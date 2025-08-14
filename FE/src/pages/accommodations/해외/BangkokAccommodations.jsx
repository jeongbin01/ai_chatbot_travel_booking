import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { AxiosClient } from "../../../api/AxiosController";
import "../../../styles/layout/Accommodations.css"; // 기존 CSS 재사용

// ===== 상수/유틸 =====
const PAGE_SIZE = 10;
const TYPES = ["전체", "모텔", "호텔·리조트", "펜션", "홈&빌라", "캠핑", "게하·한옥"];
const SORTS = [
  { key: "reco", label: "추천순" },
  { key: "priceAsc", label: "낮은 가격순" },
  { key: "priceDesc", label: "높은 가격순" },
  { key: "ratingDesc", label: "평점순" },
];
const NO_IMAGE = "/images/no-image.png";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const toMoney = (n) => `₩${(Number(n) || 0).toLocaleString()}`;
const unformatNumber = (s) => {
  const num = Number(String(s).replace(/[^0-9]/g, ""));
  return Number.isFinite(num) ? num : 0;
};

// '방콕' 포함 여부 (영문/타이 문자까지 허용)
const onlyBangkok = (a) => {
  const textLower = `${a?.name ?? ""} ${a?.location ?? ""} ${a?.address ?? ""}`.toLowerCase();
  const textRaw = `${a?.name ?? ""}${a?.location ?? ""}${a?.address ?? ""}`;
  return (
    textLower.includes("방콕") ||
    textLower.includes("bangkok") ||
    textRaw.includes("กรุงเทพ") ||            // Bangkok (Thai)
    textRaw.includes("กรุงเทพมหานคร")          // Bangkok Metropolis (Thai)
  );
};

// localStorage favorites
const getInitialFavorites = () => {
  try {
    const favorites = localStorage.getItem("favorites");
    return favorites ? JSON.parse(favorites) : [];
  } catch {
    return [];
  }
};

export default function BangkokAccommodations() {
  const navigate = useNavigate();
  const loaderRef = useRef(null);

  // 데이터/상태
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [items, setItems] = useState([]); // 방콕만
  const [favorites, setFavorites] = useState(getInitialFavorites);

  // 필터 상태
  const [type, setType] = useState("전체");
  const [excludeSoldout, setExcludeSoldout] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("reco");

  // 표시용 문자열(콤마 포함)
  const [minPriceStr, setMinPriceStr] = useState("0");
  const [maxPriceStr, setMaxPriceStr] = useState("500000");

  // 무한 스크롤 페이지
  const [page, setPage] = useState(1);

  // ===== 데이터 로드 (방콕만) =====
  const fetchBangkok = useCallback(async () => {
    setLoading(true);
    setErrMsg("");
    setPage(1);

    try {
      // 1) 서버 파라미터로 1차 시도
      const res = await AxiosClient("accommodations").get("", {
        params: { region: "방콕", location: "방콕", keyword: "방콕" },
      });

      const raw = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.content)
        ? res.data.content
        : [];

      let data = raw;

      // 2) 실패 시 전체 조회 후 필터
      if (!data.length) {
        const all = await AxiosClient("accommodations").getAll();
        data = Array.isArray(all?.data) ? all.data : [];
      }

      // ✅ 최종 방콕만 강제 (한글/영문/타이 문자 포함)
      data = data.filter(onlyBangkok);

      // id 정규화
      const normalized = data.map((i) => ({
        ...i,
        id: i.id ?? i.accommodationId ?? i.accommodation_id,
      }));

      setItems(normalized);
    } catch (e) {
      console.error(e);
      setErrMsg("방콕 숙소를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBangkok();
  }, [fetchBangkok]);

  // 가격 범위 자동 세팅
  const priceRange = useMemo(() => {
    const prices = (items || [])
      .map((i) => i.basePrice ?? i.price ?? i.minPrice)
      .filter((p) => typeof p === "number" && p > 0);

    if (prices.length === 0) return { lo: 0, hi: 500000 };
    return { lo: Math.min(...prices), hi: Math.max(...prices) };
  }, [items]);

  // 서버 가격 범위 → 숫자 상태 갱신
  useEffect(() => {
    if (priceRange.lo !== minPrice || priceRange.hi !== maxPrice) {
      setMinPrice(priceRange.lo);
      setMaxPrice(priceRange.hi);
    }
  }, [priceRange.lo, priceRange.hi]);

  // 숫자 상태 → 표시용 문자열 동기화
  useEffect(() => {
    setMinPriceStr(String(minPrice.toLocaleString()));
    setMaxPriceStr(String(maxPrice.toLocaleString()));
  }, [minPrice, maxPrice]);

  // 필터/정렬 바뀌면 페이지 리셋
  useEffect(() => {
    setPage(1);
  }, [type, excludeSoldout, minPrice, maxPrice, minRating, sort]);

  // ===== 가격 입력 핸들러(콤마 포함) =====
  const onChangeMinPrice = (e) => {
    const raw = e.target.value;
    let next = unformatNumber(raw);
    next = clamp(next, 0, maxPrice);
    setMinPrice(next);
    setMinPriceStr(next.toLocaleString());
  };

  const onChangeMaxPrice = (e) => {
    const raw = e.target.value;
    let next = unformatNumber(raw);
    next = Math.max(next, minPrice);
    setMaxPrice(next);
    setMaxPriceStr(next.toLocaleString());
  };

  // ===== 필터 + 정렬 =====
  const processed = useMemo(() => {
    let list = [...items];

    // 타입
    if (type !== "전체") {
      list = list.filter((i) => {
        const itemType = i.accommodationType || i.type || "";
        return itemType.includes(type);
      });
    }

    // 품절 제외
    if (excludeSoldout) list = list.filter((i) => !i.soldout);

    // 가격/평점
    list = list.filter((i) => {
      const price = Number(i.basePrice ?? i.price ?? i.minPrice ?? 0) || 0;
      return price >= minPrice && price <= maxPrice;
    });
    list = list.filter((i) => {
      const rating = Number(i.averageRating ?? i.rating ?? 0) || 0;
      return rating >= minRating;
    });

    // 정렬
    const getPrice = (x) => Number(x?.basePrice ?? x?.price ?? x?.minPrice ?? 0) || 0;
    const getRating = (x) => Number(x?.averageRating ?? x?.rating ?? 0) || 0;

    list.sort((a, b) => {
      const priceA = getPrice(a);
      const priceB = getPrice(b);
      const ratingA = getRating(a);
      const ratingB = getRating(b);

      switch (sort) {
        case "priceAsc": {
          const aMissing = priceA <= 0, bMissing = priceB <= 0;
          if (aMissing && !bMissing) return 1;
          if (!aMissing && bMissing) return -1;
          return priceA - priceB;
        }
        case "priceDesc": {
          const aMissing = priceA <= 0, bMissing = priceB <= 0;
          if (aMissing && !bMissing) return 1;
          if (!aMissing && bMissing) return -1;
          return priceB - priceA;
        }
        case "ratingDesc": {
          const aMissing = ratingA <= 0, bMissing = ratingB <= 0;
          if (aMissing && !bMissing) return 1;
          if (!aMissing && bMissing) return -1;
          return ratingB - ratingA;
        }
        case "reco":
        default: {
          const priceScoreA = priceA > 0 ? -priceA * 0.01 : -500;
          const priceScoreB = priceB > 0 ? -priceB * 0.01 : -500;
          const scoreA = ratingA * 1000 + priceScoreA;
          const scoreB = ratingB * 1000 + priceScoreB;
          return scoreB - scoreA;
        }
      }
    });

    return list;
  }, [items, type, excludeSoldout, minPrice, maxPrice, minRating, sort]);

  const total = processed.length;

  // ===== 무한 스크롤 페이지 아이템 =====
  const pageItems = useMemo(() => processed.slice(0, PAGE_SIZE * page), [processed, page]);

  // ===== 무한 스크롤 옵저버 =====
  useEffect(() => {
    const current = loaderRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => {
            const maxPage = Math.ceil(total / PAGE_SIZE);
            return prev < maxPage ? prev + 1 : prev;
          });
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observer.observe(current);
    return () => observer.disconnect();
  }, [total, loading]);

  // ===== 찜 토글 =====
  const toggleFavorite = useCallback((id) => {
    if (!id || isNaN(Number(id))) return;

    setFavorites((prev) => {
      const numId = Number(id);
      const next = prev.includes(numId)
        ? prev.filter((f) => f !== numId)
        : [...prev, numId];

      try {
        localStorage.setItem("favorites", JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  // ===== 카드 렌더 =====
  const renderCard = useCallback(
    (item) => {
      const id = item.id ?? item.accommodationId ?? item.accommodation_id;
      const idNum = Number(id);
      const disabled = !id || isNaN(idNum);

      const name = item.name || "이름 미정";
      const location = item.location || "";

      const ratingNum = Number(item.averageRating ?? item.rating);
      const priceNum = Number(item.basePrice ?? item.price ?? item.minPrice);

      const displayRating =
        Number.isFinite(ratingNum) && ratingNum > 0 ? ratingNum.toFixed(1) : "신규";
      const displayPrice =
        Number.isFinite(priceNum) && priceNum > 0 ? toMoney(priceNum) : "가격 문의";

      const imageUrl =
        item.thumbnailUrl ||
        item.image ||
        (Array.isArray(item.images) && item.images.length > 0
          ? item.images[0]
          : NO_IMAGE);

      const isFavorite = favorites.includes(idNum);

      const handleCardClick = () => {
        if (!disabled) navigate(`/accommodations/detail/${idNum}`);
      };

      const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (!disabled) toggleFavorite(idNum);
      };

      return (
        <article
          key={`item-${id}`}
          className={`srch-item ${disabled ? "is-disabled" : ""}`}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={handleCardClick}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) handleCardClick();
          }}
        >
          {/* 썸네일 */}
          <div
            className="srch-thumb"
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            {/* 찜 버튼 */}
            <button
              className={`fav-btn ${isFavorite ? "is-active" : ""}`}
              onClick={handleFavoriteClick}
              disabled={disabled}
              aria-label={isFavorite ? "찜 해제하기" : "찜하기"}
              aria-pressed={isFavorite}
              type="button"
            >
              <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`} />
            </button>
          </div>

          {/* 메타 */}
          <div className="srch-meta">
            <div className="srch-meta-top">
              <div className="srch-title" title={name}>
                {name}
              </div>
              <div className="srch-rating">
                {displayRating === "신규" ? (
                  <>신규</>
                ) : (
                  <>
                    <i className="bi bi-star-fill star" />
                    <span className="rating-score">{displayRating}</span>
                  </>
                )}
              </div>
            </div>

            <div className="srch-sub">{location && <span>{location}</span>}</div>

            <div className={`srch-price ${displayPrice === "가격 문의" ? "is-missing" : ""}`}>
              {displayPrice}
            </div>
          </div>
        </article>
      );
    },
    [favorites, navigate, toggleFavorite]
  );

  return (
    <div className="jeju-page">
      {/* 헤더 */}
      <div className="jeju-header">
        <div className="jeju-header-inner">
          <h1>
            ‘방콕’ 숙소 검색 결과
            <span>{total.toLocaleString()}개</span>
          </h1>

          <div className="jeju-sort">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="정렬 기준"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <main className="jeju-main">
        <div className="srch-body">
          {/* 좌측 필터 */}
          <aside className="srch-filters">
            {/* 숙소 타입 */}
            <div className="filter-group">
              <h3>숙소 타입</h3>
              <div className="filter-options">
                {TYPES.map((t) => (
                  <label key={t} className="filter-option">
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={type === t}
                      onChange={(e) => setType(e.target.value)}
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 가격 범위 */}
            <div className="filter-group">
              <h3>가격 범위</h3>
              <div className="price-range">
                <div className="price-inputs">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9,]*"
                    value={minPriceStr}
                    onChange={onChangeMinPrice}
                  />
                  <span>~</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9,]*"
                    value={maxPriceStr}
                    onChange={onChangeMaxPrice}
                  />
                </div>
                <div className="price-range-display">
                  {toMoney(minPrice)} ~ {toMoney(maxPrice)}
                </div>
              </div>
            </div>

            {/* 평점 */}
            <div className="filter-group">
              <h3>최소 평점</h3>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >
                <option value={0}>전체</option>
                <option value={3}>3점 이상</option>
                <option value={4}>4점 이상</option>
                <option value={4.5}>4.5점 이상</option>
              </select>
            </div>

            {/* 품절 제외 */}
            <div className="filter-group">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={excludeSoldout}
                  onChange={(e) => setExcludeSoldout(e.target.checked)}
                />
                <span>품절 제외</span>
              </label>
            </div>
          </aside>

          {/* 우측 리스트 */}
          <section className="srch-list">
            {loading && (
              <div className="skeleton-wrap">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="skeleton-card" />
                ))}
              </div>
            )}

            {!loading && errMsg && (
              <div className="status error" role="alert">
                {errMsg}
              </div>
            )}

            {!loading && !errMsg && pageItems.length === 0 && (
              <div className="status empty">조건에 맞는 결과가 없어요.</div>
            )}

            {!loading && !errMsg && pageItems.length > 0 && (
              <>
                <div className="grid">{pageItems.map(renderCard)}</div>

                {/* 무한 스크롤 트리거 */}
                {pageItems.length < total && (
                  <div
                    ref={loaderRef}
                    className="loader-trigger"
                    style={{ height: 50 }}
                  >
                    <div className="loading-indicator">더 많은 결과를 불러오는 중...</div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
