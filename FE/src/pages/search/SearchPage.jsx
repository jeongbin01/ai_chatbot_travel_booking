// src/pages/search/SearchPage.jsx
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AxiosClient } from "../../api/AxiosController";
import "../../styles/layout/SearchPage.css";

const PAGE_SIZE = 10;
const TYPES = [
  "전체",
  "모텔",
  "호텔·리조트",
  "펜션",
  "홈&빌라",
  "캠핑",
  "게하·한옥",
];
const SORTS = [
  { key: "reco", label: "추천순" },
  { key: "priceAsc", label: "낮은 가격순" },
  { key: "priceDesc", label: "높은 가격순" },
  { key: "ratingDesc", label: "평점순" },
];

// Helper function to get favorites from localStorage
const getInitialFavorites = () => {
  try {
    const favorites = localStorage.getItem("favorites");
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Failed to parse favorites from localStorage", error);
    return [];
  }
};

export default function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const loaderRef = useRef(null);

  // 쿼리
  const tab = (params.get("tab") || "domestic").toLowerCase();
  const q = params.get("q") || "";
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = Number(params.get("guests") || 1);

  // 데이터/상태
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState(getInitialFavorites);

  // 필터 상태
  const [type, setType] = useState("전체");
  const [excludeSoldout, setExcludeSoldout] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("reco");
  const [page, setPage] = useState(1);

  const tabLabel =
    tab === "domestic"
      ? "국내 숙소"
      : tab === "overseas"
      ? "해외 숙소"
      : tab === "package"
      ? "액티비티"
      : "전체";

  // 데이터 로드
  useEffect(() => {
    let cancel = false;
    async function run() {
      setLoading(true);
      setErrMsg("");
      setPage(1); // 새로운 검색 시 페이지 리셋
      try {
        if (tab === "package") {
          setItems([]);
        } else {
          const res = await AxiosClient("accommodations").get("", {
            params: {
              q: q.trim() || undefined,
              isDomestic: tab === "domestic" ? "Y" : "N",
              checkIn: checkIn || undefined,
              checkOut: checkOut || undefined,
              guests: guests || undefined,
            },
          });

          const raw = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.content)
            ? res.data.content
            : [];

          const normalized = raw.map((i) => ({
            ...i,
            id: i.id ?? i.accommodationId ?? i.accommodation_id,
          }));

          if (!cancel) {
            setItems(normalized);
          }
        }
      } catch (e) {
        console.error(e);
        if (!cancel) {
          setErrMsg("검색 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
        }
      } finally {
        if (!cancel) {
          setLoading(false);
        }
      }
    }
    run();
    return () => {
      cancel = true;
    };
  }, [tab, q, checkIn, checkOut, guests]);

  // 가격 범위 자동 세팅
  const priceRange = useMemo(() => {
    const prices = (items || [])
      .map((i) => i.basePrice ?? i.price ?? i.minPrice)
      .filter((p) => typeof p === "number" && p > 0);

    if (prices.length === 0) return { lo: 0, hi: 500000 };

    const lo = Math.min(...prices);
    const hi = Math.max(...prices);
    return { lo, hi };
  }, [items]);

  // 필터가 변경될 때 페이지 리셋
  useEffect(() => {
    setPage(1);
  }, [type, excludeSoldout, minPrice, maxPrice, minRating, sort]);

  // 가격 범위가 변경될 때만 가격 필터 업데이트
  useEffect(() => {
    if (priceRange.lo !== minPrice || priceRange.hi !== maxPrice) {
      setMinPrice(priceRange.lo);
      setMaxPrice(priceRange.hi);
    }
  }, [priceRange.lo, priceRange.hi]);

  // 필터+정렬
  const processed = useMemo(() => {
    let list = [...items];

    // 검색어 필터링
    if (q.trim()) {
      const keyword = q.trim().toLowerCase();
      list = list.filter(
        (i) =>
          (i.name || "").toLowerCase().includes(keyword) ||
          (i.location || "").toLowerCase().includes(keyword) ||
          (i.description || "").toLowerCase().includes(keyword)
      );
    }

    // 숙소 타입 필터링
    if (type !== "전체") {
      list = list.filter((i) => {
        const itemType = i.accommodationType || i.type || "";
        return itemType.includes(type);
      });
    }

    // 품절 제외 필터링
    if (excludeSoldout) {
      list = list.filter((i) => !i.soldout);
    }

    // 가격 범위 필터링
    list = list.filter((i) => {
      const price = i.basePrice ?? i.price ?? i.minPrice ?? 0;
      return price >= minPrice && price <= maxPrice;
    });

    // 평점 필터링
    list = list.filter((i) => {
      const rating = i.averageRating ?? i.rating ?? 0;
      return rating >= minRating;
    });

    // ===== 정렬 =====
    const getPrice = (x) =>
      Number(x?.basePrice ?? x?.price ?? x?.minPrice ?? 0) || 0;
    const getRating = (x) =>
      Number(x?.averageRating ?? x?.rating ?? 0) || 0;

    list.sort((a, b) => {
      const priceA = getPrice(a);
      const priceB = getPrice(b);
      const ratingA = getRating(a);
      const ratingB = getRating(b);

      switch (sort) {
        case "priceAsc": {
          const aMissing = priceA <= 0;
          const bMissing = priceB <= 0;
          if (aMissing && !bMissing) return 1;   // 없는 값 뒤로
          if (!aMissing && bMissing) return -1;
          return priceA - priceB;
        }
        case "priceDesc": {
          const aMissing = priceA <= 0;
          const bMissing = priceB <= 0;
          if (aMissing && !bMissing) return 1;
          if (!aMissing && bMissing) return -1;
          return priceB - priceA;
        }
        case "ratingDesc": {
          const aMissing = ratingA <= 0;
          const bMissing = ratingB <= 0;
          if (aMissing && !bMissing) return 1;
          if (!aMissing && bMissing) return -1;
          return ratingB - ratingA;
        }
        case "reco":
        default: {
          // 추천순: 평점과 가격을 종합적으로 고려 (없는 값은 약하게 감점)
          const priceScoreA = priceA > 0 ? -priceA * 0.01 : -500; // 가격 없으면 소폭 감점
          const priceScoreB = priceB > 0 ? -priceB * 0.01 : -500;
          const scoreA = ratingA * 1000 + priceScoreA;
          const scoreB = ratingB * 1000 + priceScoreB;
          return scoreB - scoreA;
        }
      }
    });

    return list;
  }, [items, q, type, excludeSoldout, minPrice, maxPrice, minRating, sort]);

  const total = processed.length;

  // 무한 스크롤을 위한 페이지네이션
  const pageItems = useMemo(() => {
    return processed.slice(0, PAGE_SIZE * page);
  }, [processed, page]);

  // 무한 스크롤 설정
  useEffect(() => {
    const currentLoader = loaderRef.current;
    if (!currentLoader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => {
            const maxPage = Math.ceil(total / PAGE_SIZE);
            return prev < maxPage ? prev + 1 : prev;
          });
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    observer.observe(currentLoader);

    return () => {
      observer.disconnect();
    };
  }, [total, loading]);

  // 찜 버튼 토글
  const toggleFavorite = useCallback((id) => {
    if (!id || isNaN(Number(id))) return;

    setFavorites((prev) => {
      const numId = Number(id);
      const newFavorites = prev.includes(numId)
        ? prev.filter((f) => f !== numId)
        : [...prev, numId];

      try {
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
      } catch (error) {
        console.error("Failed to save favorites to localStorage", error);
      }

      return newFavorites;
    });
  }, []);

  const renderCard = useCallback(
    (item) => {
      const accId = item.accommodationId ?? item.id ?? item.accommodation_id;
      const idNum = Number(accId);
      const disabled = !accId || isNaN(idNum);

      const name = item.name || "이름 미정";
      const location = item.location || "";

      // ⭐ 가격/평점 기본값 보강
      const ratingNum = Number(item.averageRating ?? item.rating);
      const priceNum = Number(item.basePrice ?? item.price ?? item.minPrice);

      const displayRating =
        Number.isFinite(ratingNum) && ratingNum > 0
          ? ratingNum.toFixed(1)
          : "신규";
      const displayPrice =
        Number.isFinite(priceNum) && priceNum > 0
          ? `₩${priceNum.toLocaleString()}`
          : "가격 문의";

      const imageUrl =
        item.thumbnailUrl ||
        item.image ||
        (Array.isArray(item.images) && item.images.length > 0
          ? item.images[0]
          : "/images/no-image.png");

      const isFavorite = favorites.includes(idNum);

      const handleCardClick = () => {
        if (!disabled) {
          navigate(`/accommodations1/${idNum}`);
        }
      };

      const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (!disabled) {
          toggleFavorite(idNum);
        }
      };

      return (
        <article
          key={`item-${accId}`}
          className={`srch-item ${disabled ? "is-disabled" : ""}`}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              handleCardClick();
            }
          }}
        >
          {/* 썸네일 */}
          <div
            className="srch-thumb"
            style={{ backgroundImage: `url(${imageUrl})` }}
            onClick={handleCardClick}
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
              <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`}></i>
            </button>
          </div>

          {/* 정보 (사진 바깥쪽, 오른쪽 메타 영역) */}
          <div className="srch-meta">
            {/* 상단: 제목 + 평점(오른쪽) */}
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

            {/* 위치 정보 */}
            <div className="srch-sub">
              {location && <span>{location}</span>}
            </div>

            {/* 가격 (오른쪽 하단 강조) */}
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
    <main className="srch">
      <header className="srch-head">
        <h1>{`'${q || "전체"}' 검색 결과`}</h1>
        <div className="srch-conds">
          <span>{tabLabel}</span>
          <span className="sep">|</span>
          <span>
            {checkIn && checkOut
              ? `${checkIn} ~ ${checkOut}`
              : "기간 선택 없음"}
          </span>
          <span className="sep">|</span>
          <span>인원 {guests}명</span>
          <span className="sep">|</span>
          <span>총 {total}개</span>
        </div>
        <div className="srch-sort">
          <label htmlFor="sort">정렬</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="srch-body">
        {/* 필터 섹션 */}
        <aside className="srch-filters">
          {/* 숙소 타입 필터 */}
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

          {/* 가격 범위 필터 */}
          <div className="filter-group">
            <h3>가격 범위</h3>
            <div className="price-range">
              <div className="price-inputs">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  min={0}
                  max={maxPrice}
                />
                <span>~</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  min={minPrice}
                />
              </div>
              <div className="price-range-display">
                ₩{minPrice.toLocaleString()} ~ ₩{maxPrice.toLocaleString()}
              </div>
            </div>
          </div>

          {/* 평점 필터 */}
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

          {/* 기타 옵션 */}
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

        {/* 결과 리스트 */}
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
                  style={{ height: "50px" }}
                >
                  <div className="loading-indicator">
                    더 많은 결과를 불러오는 중...
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
