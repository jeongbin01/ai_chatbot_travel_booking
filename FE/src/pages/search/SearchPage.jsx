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
import useWishlistClient from "../../hooks/useWishlistClient";
import "../../styles/layout/SearchPage.css";

/* ====================== 상수 ====================== */
const PAGE_SIZE = 10;
const TYPES = ["전체", "모텔", "호텔·리조트", "펜션", "홈&빌라", "캠핑", "게하·한옥"];
const SORTS = [
  { key: "reco", label: "추천순" },
  { key: "priceAsc", label: "낮은 가격순" },
  { key: "priceDesc", label: "높은 가격순" },
  { key: "ratingDesc", label: "평점순" },
];
const NO_IMAGE = "/images/no-image.png"; // public/images/no-image.png

/* ====================== 로컬 폴백 이미지 ====================== */
// 파일 위치: src/pages/search/SearchPage.jsx → ../../assets/images/.. 로 접근
import IMG_GAPYEONG from "../../assets/images/domestic/가평 풀빌라.jpg";
import IMG_GANGHWADO_PENSION from "../../assets/images/domestic/강화도 펜션.jpg";
import IMG_GIMHAE_HOTEL from "../../assets/images/domestic/김해 호텔.jpg";
import IMG_NAMHAE_SWEET from "../../assets/images/domestic/남해 스위트.jpg";
import IMG_DAEJEON_HOTEL from "../../assets/images/domestic/대전 호텔.jpg";
import IMG_BUSAN_GWANGAN from "../../assets/images/domestic/부산 광안대교 호텔.jpg";
import IMG_BUSAN_HAEUNDAE from "../../assets/images/domestic/부산 해운대 리조트.jpg";
import IMG_SORAK_RESORT from "../../assets/images/domestic/설악산 리조트.jpg";
import IMG_SOKCHO_HOTEL from "../../assets/images/domestic/속초 호텔.jpg";
import IMG_SONGDO_HOTEL from "../../assets/images/domestic/송도 호텔.jpg";
import IMG_SUNCHEON_HANOK from "../../assets/images/domestic/순천 한옥 호텔.jpg";
import IMG_YEOSU_RESORT from "../../assets/images/domestic/여수 리조트.jpg";
import IMG_ULSAN_HOTEL from "../../assets/images/domestic/울산 호텔.jpg";
import IMG_JEONJU_HOTEL from "../../assets/images/domestic/전주 호텔.jpg";
import IMG_JEJU_SEOGWIPO from "../../assets/images/domestic/제주 서귀포 리조트.jpg";
import IMG_JEJU_HOTEL from "../../assets/images/domestic/제주 호텔.jpg";
import IMG_CHEONGDO_PENSION from "../../assets/images/domestic/청도 펜션.jpg";
import IMG_PYEONGCHANG_RESORT from "../../assets/images/domestic/평창 리조트.jpg";
import IMG_POHANG_HOTEL from "../../assets/images/domestic/포항 호텔.jpg";
// 해외
import IMG_ROME_HOTEL from "../../assets/images/overseas/로마 호텔.jpg";
import IMG_BANGKOK_HOTEL from "../../assets/images/overseas/방콕 호텔.jpg";
import IMG_SINGAPORE_HOTEL from "../../assets/images/overseas/싱가포르 호텔.jpg";

/* ====================== 키워드 → 이미지 매핑 & 폴백 ====================== */
const LOCAL_IMAGES = [
  // 국내
  { keys: ["가평", "풀빌라", "폴빌라"], img: IMG_GAPYEONG },
  { keys: ["강화", "강화도", "펜션"], img: IMG_GANGHWADO_PENSION },
  { keys: ["김해"], img: IMG_GIMHAE_HOTEL },
  { keys: ["남해", "스위트"], img: IMG_NAMHAE_SWEET },
  { keys: ["대전"], img: IMG_DAEJEON_HOTEL },
  { keys: ["부산", "광안", "광안대교"], img: IMG_BUSAN_GWANGAN },
  { keys: ["부산", "해운대", "리조트"], img: IMG_BUSAN_HAEUNDAE },
  { keys: ["설악", "설악산"], img: IMG_SORAK_RESORT },
  { keys: ["속초"], img: IMG_SOKCHO_HOTEL },
  { keys: ["송도"], img: IMG_SONGDO_HOTEL },
  { keys: ["순천", "한옥"], img: IMG_SUNCHEON_HANOK },
  { keys: ["여수"], img: IMG_YEOSU_RESORT },
  { keys: ["울산"], img: IMG_ULSAN_HOTEL },
  { keys: ["전주"], img: IMG_JEONJU_HOTEL },
  { keys: ["제주", "서귀포"], img: IMG_JEJU_SEOGWIPO },
  { keys: ["제주"], img: IMG_JEJU_HOTEL },
  { keys: ["청도"], img: IMG_CHEONGDO_PENSION },
  { keys: ["평창"], img: IMG_PYEONGCHANG_RESORT },
  { keys: ["포항"], img: IMG_POHANG_HOTEL },
  // 해외
  { keys: ["로마", "rome"], img: IMG_ROME_HOTEL },
  { keys: ["방콕", "bangkok"], img: IMG_BANGKOK_HOTEL },
  { keys: ["싱가포르", "singapore"], img: IMG_SINGAPORE_HOTEL },
];

function pickLocalFallback({ name = "", location = "" }) {
  const text = `${name} ${location}`.toLowerCase();
  for (const { keys, img } of LOCAL_IMAGES) {
    if (keys.some((k) => text.includes(k.toLowerCase()))) return img;
  }
  return null;
}

/* ====================== 유틸 ====================== */
const toMoney = (n) => `${(Number(n) || 0).toLocaleString()}원`;
const onlyDigits = (s) => (s || "").replace(/[^\d]/g, "");
const takePrice = (x) => Number(x?.basePrice ?? x?.price ?? x?.minPrice ?? 0) || 0;
const hasValidPrice = (x) => takePrice(x) > 0;

/* ====================== 컴포넌트 ====================== */
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

  // 상태
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [items, setItems] = useState([]);

  // ⭐ 공용 위시리스트 훅 사용
  const { isWished, toggleWish } = useWishlistClient();
  const isFavorite = useCallback((id) => Boolean(isWished?.(id)), [isWished]);

  // 필터
  const [type, setType] = useState("전체");
  const [excludeSoldout, setExcludeSoldout] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("reco");
  const [page, setPage] = useState(1);

  // 가격 입력창(문자열) - UX
  const [minPriceStr, setMinPriceStr] = useState("0");
  const [maxPriceStr, setMaxPriceStr] = useState("500,000");

  const tabLabel =
    tab === "domestic" ? "국내 숙소" :
    tab === "overseas" ? "해외 숙소" :
    tab === "package" ? "액티비티" : "전체";

  /* ====================== 데이터 로드 + 가격 폴백 병합 ====================== */
  useEffect(() => {
    let cancel = false;

    (async () => {
      setLoading(true);
      setErrMsg("");
      setPage(1);

      try {
        if (tab === "package") {
          setItems([]);
        } else {
          // 1) 기본 숙소 검색
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

          // 2) rooms 에서 "숙소별 최저가 + 대표 이미지" 폴백 수집 (가능한 경우)
          let minPriceMap = new Map();
          let firstImgMap = new Map();

          try {
            const roomsRes = await AxiosClient("accommodations-rooms").get("", {
              params: { isDomestic: tab === "domestic" ? "Y" : "N" },
            });

            const rows = Array.isArray(roomsRes?.data) ? roomsRes.data : [];
            // 일반적으로 배열(row)로 내려오면 [0]=id, [16]=image, [22]=basePrice 같은 형태를 가정
            const ID_IDX = 0, IMG_IDX = 16, PRICE_IDX = 22;

            for (const row of rows) {
              const accId = row?.[ID_IDX];
              const basePrice = Number(row?.[PRICE_IDX]);
              const img = row?.[IMG_IDX];

              if (accId == null) continue;
              if (Number.isFinite(basePrice) && basePrice > 0) {
                const prev = minPriceMap.get(accId);
                if (!Number.isFinite(prev) || basePrice < prev) {
                  minPriceMap.set(accId, basePrice);
                }
              }
              if (img && !firstImgMap.has(accId)) {
                firstImgMap.set(accId, img);
              }
            }
          } catch (e) {
            // rooms API가 없거나 스키마가 다르면 조용히 폴백 skip
            console.warn("rooms fetch skipped:", e?.message || e);
          }

          // 3) 정규화 + 폴백 병합
          const normalized = raw.map((i) => {
            const id = i.id ?? i.accommodationId ?? i.accommodation_id;
            const merged = { ...i, id };

            if (!hasValidPrice(merged)) {
              const p = minPriceMap.get(id);
              if (Number.isFinite(p) && p > 0) merged.basePrice = p;
            }

            if (!merged.image && !merged.thumbnailUrl && !merged.imageUrl) {
              const img = firstImgMap.get(id);
              if (img) merged.image = img;
            }

            return merged;
          });

          if (!cancel) setItems(normalized);
        }
      } catch (e) {
        console.error(e);
        if (!cancel) setErrMsg("검색 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => { cancel = true; };
  }, [tab, q, checkIn, checkOut, guests]);

  /* ====================== 가격 범위 자동 세팅 ====================== */
  const priceRange = useMemo(() => {
    const prices = (items || [])
      .map((i) => i.basePrice ?? i.price ?? i.minPrice)
      .filter((p) => typeof p === "number" && p > 0);

    if (prices.length === 0) return { lo: 0, hi: 500000 };
    return { lo: Math.min(...prices), hi: Math.max(...prices) };
  }, [items]);

  // 내부 숫자 상태 → 입력 문자열 동기화
  useEffect(() => {
    setMinPriceStr((Number(minPrice) || 0).toLocaleString());
  }, [minPrice]);
  useEffect(() => {
    setMaxPriceStr((Number(maxPrice) || 0).toLocaleString());
  }, [maxPrice]);

  // 필터 변경 시 페이지 리셋
  useEffect(() => { setPage(1); }, [type, excludeSoldout, minPrice, maxPrice, minRating, sort]);

  // 가격 범위 반영
  useEffect(() => {
    if (priceRange.lo !== minPrice || priceRange.hi !== maxPrice) {
      setMinPrice(priceRange.lo);
      setMaxPrice(priceRange.hi);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange.lo, priceRange.hi]);

  // 가격 입력 핸들러
  const onChangeMinPrice = (e) => {
    const raw = onlyDigits(e.target.value);
    setMinPriceStr(raw.length ? Number(raw).toLocaleString() : "");
    setMinPrice(raw.length ? Number(raw) : 0);
  };
  const onChangeMaxPrice = (e) => {
    const raw = onlyDigits(e.target.value);
    setMaxPriceStr(raw.length ? Number(raw).toLocaleString() : "");
    setMaxPrice(raw.length ? Number(raw) : 0);
  };

  /* ====================== 필터 + 정렬 ====================== */
  const processed = useMemo(() => {
    let list = [...items];

    // 검색어 필터
    if (q.trim()) {
      const keyword = q.trim().toLowerCase();
      list = list.filter((i) =>
        (i.name || "").toLowerCase().includes(keyword) ||
        (i.location || "").toLowerCase().includes(keyword) ||
        (i.description || "").toLowerCase().includes(keyword)
      );
    }

    // 타입
    if (type !== "전체") {
      list = list.filter((i) => {
        const itemType = i.accommodationType || i.type || "";
        return itemType.includes(type);
      });
    }

    // 품절 제외
    if (excludeSoldout) list = list.filter((i) => !i.soldout);

    // 가격
    list = list.filter((i) => {
      const price = takePrice(i);
      return price >= minPrice && price <= maxPrice;
    });

    // 평점
    list = list.filter((i) => {
      const rating = Number(i.averageRating ?? i.rating ?? 0) || 0;
      return rating >= minRating;
    });

    const getPrice = takePrice;
    const getRating = (x) => Number(x?.averageRating ?? x?.rating ?? 0) || 0;

    list.sort((a, b) => {
      const priceA = getPrice(a), priceB = getPrice(b);
      const ratingA = getRating(a), ratingB = getRating(b);

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
          // 추천 점수: 평점↑ + 가격↓
          const priceScoreA = priceA > 0 ? -priceA * 0.01 : -500;
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
  const pageItems = useMemo(() => processed.slice(0, PAGE_SIZE * page), [processed, page]);

  /* ====================== 무한 스크롤 ====================== */
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

  /* ====================== 카드 렌더 ====================== */
  const renderCard = useCallback(
    (item) => {
      const id = item.id ?? item.accommodationId ?? item.accommodation_id;
      const idNum = Number(id);
      const disabled = !id || isNaN(idNum);

      const name = item.name || "이름 미정";
      const location = item.location || item.address || "";

      // 평점
      const ratingRaw = item.averageRating ?? item.rating ?? item.ratingAvg;
      const ratingNum = Number.parseFloat(String(ratingRaw));
      const hasRatingVal = Number.isFinite(ratingNum) && ratingNum > 0;
      const displayRating = hasRatingVal ? ratingNum.toFixed(1) : null;

      // 가격
      const itemHasPrice = hasValidPrice(item);
      const priceNum = takePrice(item);

      // 이미지 (로컬 폴백 포함)
      const localFallback = pickLocalFallback({ name, location });
      const imageUrl =
        item.image ||
        item.thumbnailUrl ||
        item.imageUrl ||
        item.mainImageUrl ||
        item.firstImageUrl ||
        (Array.isArray(item.images) && item.images[0]) ||
        localFallback ||
        "";

      const wished = isFavorite(idNum);

      const handleCardClick = () => {
        if (!disabled) navigate(`/accommodations/detail/${idNum}`);
      };

      const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (disabled) return;
        toggleWish({
          id: idNum,
          name,
          image: imageUrl || NO_IMAGE,
          location,
          price: Number.isFinite(priceNum) ? priceNum : 0,
        });
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
          {/* ✅ 썸네일 (이미지 꽉 + 중앙 포커스) */}
          <div className="srch-thumb" style={{ "--obj-x": "50%", "--obj-y": "50%" }}>
            <img
              src={imageUrl || NO_IMAGE}
              alt={`${name} 이미지`}
              loading="lazy"
              onError={(e) => {
                if (!e.currentTarget.src.endsWith(NO_IMAGE)) e.currentTarget.src = NO_IMAGE;
              }}
            />

            {/* 찜 버튼 */}
            <button
              className={`fav-btn ${wished ? "is-active" : ""}`}
              onClick={handleFavoriteClick}
              disabled={disabled}
              aria-label={wished ? "찜 해제하기" : "찜하기"}
              aria-pressed={wished}
              type="button"
              title={wished ? "찜 해제" : "찜하기"}
              style={{
                position: "absolute",
                right: 8,
                top: 8,
                background: "transparent",
                boxShadow: "none",
                width: 32,
                height: 32,
                border: "none",
                padding: 0,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,.25))",
              }}
            >
              <i
                className={`bi ${wished ? "bi-heart-fill" : "bi-heart"}`}
                style={{ fontSize: 20, color: wished ? "var(--heart-color)" : "#ffffff" }}
              />
            </button>
          </div>

          {/* 메타 */}
          <div className="srch-meta srch-meta--split">
            <div className="srch-info">
              <div className="srch-title" title={name}>
                {name}
              </div>
              {location && (
                <div className="srch-loc" title={location}>
                  {location}
                </div>
              )}
              {hasRatingVal && (
                <div className="srch-rating">
                  <i className="bi bi-star-fill star" />
                  <span className="rating-score">{displayRating}</span>
                </div>
              )}
            </div>

            {/* ✅ 가격: 없으면 '가격 문의' */}
            <div className="srch-pricebox">
              {itemHasPrice ? (
                <div className="srch-price">{toMoney(priceNum)}</div>
              ) : (
                <div className="srch-price" style={{ color: "#999", fontSize: "0.9em" }}>
                  가격 문의
                </div>
              )}
            </div>
          </div>
        </article>
      );
    },
    [isFavorite, navigate, toggleWish]
  );

  /* ====================== UI ====================== */
  return (
    <div className="srch">
      <header className="srch-head">
        <h1>{`'${q || "전체"}' 검색 결과 (${tabLabel})`} {total.toLocaleString()}개</h1>
        <div className="srch-conds">
          <span>
            {checkIn && checkOut ? `${checkIn} ~ ${checkOut}` : "기간 선택 없음"}
          </span>
          <span className="sep">|</span>
          <span>인원 {guests}명</span>
        </div>
        <div className="srch-sort">
          <label htmlFor="sort" className="sr-only">정렬</label>
          <select
            id="sort"
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
      </header>

      {/* 본문 */}
      <main className="jeju-main">
        <div className="srch-body">
          {/* 좌측 필터 */}
          <aside className="srch-filters">
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
                    placeholder="최소가격"
                  />
                  <span>~</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9,]*"
                    value={maxPriceStr}
                    onChange={onChangeMaxPrice}
                    placeholder="최대가격"
                  />
                </div>
                <div className="price-range-display">
                  {toMoney(minPrice)} ~ {toMoney(maxPrice)}
                </div>
              </div>
            </div>

            <div className="filter-group">
              <h3>최소 평점</h3>
              <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                <option value={0}>전체</option>
                <option value={3}>3점 이상</option>
                <option value={4}>4점 이상</option>
                <option value={4.5}>4.5점 이상</option>
              </select>
            </div>

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
                  <div ref={loaderRef} className="loader-trigger" style={{ height: 50 }}>
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
