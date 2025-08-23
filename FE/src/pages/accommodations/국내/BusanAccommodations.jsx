// src/pages/accommodations/BusanAccommodations.jsx
import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosClient } from "../../../api/AxiosController";
import "../../../styles/layout/Accommodations.css";
import useWishlistClient from "../../../hooks/useWishlistClient";

// ✅ 로컬 폴백 이미지
import IMG_GWANGAN_HOTEL from "../../../assets/images/domestic/부산 광안대교 호텔.jpg";
import IMG_HAEUNDAE_RESORT from "../../../assets/images/domestic/부산 해운대 리조트.jpg";

/* ====================== 상수/유틸 ====================== */
const PAGE_SIZE = 10;
const TYPES = ["전체", "모텔", "호텔·리조트", "펜션", "홈&빌라", "캠핑", "게하·한옥"];
const SORTS = [
  { key: "reco", label: "추천순" },
  { key: "priceAsc", label: "낮은 가격순" },
  { key: "priceDesc", label: "높은 가격순" },
  { key: "ratingDesc", label: "평점순" },
];
const NO_IMAGE = "/images/no-image.png"; // public/images/no-image.png

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const toMoney = (n) => `${(Number(n) || 0).toLocaleString()}원`;
const unformatNumber = (s) => {
  const num = Number(String(s).replace(/[^0-9]/g, ""));
  return Number.isFinite(num) ? num : 0;
};

// '부산' 포함 여부
const onlyBusan = (a) => {
  const text = `${a?.name ?? ""} ${a?.location ?? ""} ${a?.address ?? ""}`.toLowerCase();
  return text.includes("부산");
};

// 이름 → 슬러그
const toSlug = (s) => String(s || "").replace(/[^가-힣a-zA-Z0-9]+/g, "").toLowerCase();

// 🔥 다양한 필드에서 가격 추출
const getPrice = (x = {}) => {
  const toNum = (v) => {
    if (v == null || v === "") return NaN;
    const str = String(v).replace(/[^0-9.]/g, "");
    const n = Number(str);
    return Number.isFinite(n) && n > 0 ? n : NaN;
  };
  const priceFields = [
    x.basePrice, x.price, x.minPrice, x.lowestPrice,
    x.roomPrice, x.nightPrice, x.defaultPrice,
    x.standardPrice, x.regularPrice, x.currentPrice,
    x.pricePerNight, x.cost, x.fee, x.amount
  ];
  const valid = priceFields.map(toNum).filter((n) => Number.isFinite(n) && n > 0);
  return valid.length > 0 ? Math.min(...valid) : NaN;
};

const hasValidPrice = (x = {}) => {
  const priceFields = [
    x.basePrice, x.price, x.minPrice, x.lowestPrice,
    x.roomPrice, x.nightPrice, x.defaultPrice,
    x.standardPrice, x.regularPrice, x.currentPrice,
    x.pricePerNight, x.cost, x.fee, x.amount
  ];
  return priceFields.some((field) => {
    if (field == null || field === "") return false;
    const num = Number(String(field).replace(/[^0-9.]/g, ""));
    return Number.isFinite(num) && num > 0;
  });
};

// ✅ 로컬 폴백 매핑
const LOCAL_FALLBACKS = {
  [toSlug("부산 해운대 리조트")]: IMG_HAEUNDAE_RESORT,
  [toSlug("부산 광안대교 호텔")]: IMG_GWANGAN_HOTEL,
};

/** ✅ 썸네일 포커스(초점) 좌표 매핑
 * object-position: var(--obj-x) var(--obj-y) 로 전달
 * 필요에 따라 여기 좌표만 손봐도 카드별 크롭 위치를 미세 조정 가능
 */
const FOCUS_MAP = {
  [toSlug("부산 해운대 리조트")]: { x: "50%", y: "45%" },   // 수영장 수평선 강조
  [toSlug("부산 광안대교 뷰 호텔")]: { x: "50%", y: "60%" } // 다리 야경 아래쪽 강조
};

/* ====================== 컴포넌트 ====================== */
export default function BusanAccommodations() {
  const navigate = useNavigate();
  const loaderRef = useRef(null);

  // ✅ 공용 찜 훅
  const { isWished, toggleWish } = useWishlistClient();
  const isFavorite = useCallback((id) => isWished(id), [isWished]);

  // 데이터/상태
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [items, setItems] = useState([]); // 부산만

  // 필터 상태
  const [type, setType] = useState("전체");
  const [excludeSoldout, setExcludeSoldout] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("reco"); // ✨ 'reco'를 기본값으로 설정

  // 표시용 문자열
  const [minPriceStr, setMinPriceStr] = useState("0");
  const [maxPriceStr, setMaxPriceStr] = useState("500000");

  // 무한 스크롤 페이지
  const [page, setPage] = useState(1);

  // ===== 데이터 로드 (부산 + 최저가 맵 병합) =====
  const fetchBusan = useCallback(async () => {
    setLoading(true);
    setErrMsg("");
    setPage(1);

    try {
      // 1) 부산 숙소 목록
      const res = await AxiosClient("accommodations").get("", {
        params: { region: "부산", location: "부산", keyword: "부산" },
      });

      const raw = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.content)
          ? res.data.content
          : [];

      let data = raw;
      if (!data.length && typeof AxiosClient("accommodations").getAll === "function") {
        const all = await AxiosClient("accommodations").getAll();
        data = Array.isArray(all?.data) ? all.data : [];
      }
      data = data.filter(onlyBusan);

      // 2) 국내 숙소의 "숙소별 최저가" 맵 생성 (accommodations-rooms)
      //    서버 응답 인덱스: id(0), address(1), isDomestic(7), name(10), ratingAvg(11), image(16), basePrice(22)
      const roomsRes = await AxiosClient("accommodations-rooms").get("", {
        params: { isDomestic: "Y" },
      });
      const rooms = Array.isArray(roomsRes?.data) ? roomsRes.data : [];
      const PRICE_IDX = 22, ID_IDX = 0, IMG_IDX = 16;

      const minPriceMap = new Map();   // id -> min price number
      const firstImgMap = new Map();   // id -> image url (rooms 기준)

      for (const row of rooms) {
        const accId = row?.[ID_IDX];
        const basePrice = Number(row?.[PRICE_IDX]);
        const img = row?.[IMG_IDX];

        if (accId == null) continue;
        if (Number.isFinite(basePrice)) {
          const prev = minPriceMap.get(accId);
          if (!Number.isFinite(prev) || basePrice < prev) {
            minPriceMap.set(accId, basePrice);
          }
        }
        if (img && !firstImgMap.has(accId)) {
          firstImgMap.set(accId, img);
        }
      }

      // 3) 부산 목록에 최저가/이미지 병합
      const normalized = data.map((i) => {
        const id = i.id ?? i.accommodationId ?? i.accommodation_id;
        const merged = { ...i, id };

        // 가격이 없으면 최저가 주입
        if (!hasValidPrice(merged)) {
          const p = minPriceMap.get(id);
          if (Number.isFinite(p)) merged.basePrice = p;
        }

        // 이미지가 없으면 rooms 이미지 폴백
        if (!merged.image && !merged.thumbnailUrl && !merged.imageUrl) {
          const img = firstImgMap.get(id);
          if (img) merged.image = img;
        }

        return merged;
      });

      setItems(normalized);
    } catch (e) {
      console.error(e);
      setErrMsg("부산 숙소를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusan();
  }, [fetchBusan]);

  // ===== 가격 범위 자동 세팅 =====
  const priceRange = useMemo(() => {
    const prices = (items || [])
      .filter(hasValidPrice)
      .map(getPrice)
      .filter((p) => Number.isFinite(p) && p > 0);

    if (!prices.length) return { lo: 0, hi: 500000 };
    return { lo: Math.min(...prices), hi: Math.max(...prices) };
  }, [items]);

  useEffect(() => {
    if (priceRange.lo !== minPrice || priceRange.hi !== maxPrice) {
      setMinPrice(priceRange.lo);
      setMaxPrice(priceRange.hi);
    }
  }, [priceRange.lo, priceRange.hi]); // eslint-disable-line

  useEffect(() => {
    setMinPriceStr(String(minPrice.toLocaleString()));
    setMaxPriceStr(String(maxPrice.toLocaleString()));
  }, [minPrice, maxPrice]);

  // 필터/정렬 바뀌면 페이지 리셋
  useEffect(() => {
    setPage(1);
  }, [type, excludeSoldout, minPrice, maxPrice, minRating, sort]);

  // ===== 가격 입력 핸들러 =====
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

    // 타입 필터
    if (type !== "전체") {
      list = list.filter((i) => {
        const itemType = i.accommodationType || i.type || "";
        return itemType.includes(type);
      });
    }

    // 품절 제외
    if (excludeSoldout) list = list.filter((i) => !i.soldout);

    // 가격 필터
    list = list.filter((i) => {
      if (!hasValidPrice(i)) return true; // 가격 정보 없으면 통과
      const p = getPrice(i);
      return p >= minPrice && p <= maxPrice;
    });

    // 평점 필터
    list = list.filter((i) => {
      const rating = Number(i?.averageRating ?? i?.rating ?? 0) || 0;
      return rating >= minRating;
    });

    // 정렬
    const priceOf = (x) => getPrice(x);
    const ratingOf = (x) => Number(x?.averageRating ?? x?.rating ?? 0) || 0;

    list.sort((a, b) => {
      const priceA = priceOf(a), priceB = priceOf(b);
      const ratingA = ratingOf(a), ratingB = ratingOf(b);

      switch (sort) {
        case "priceAsc": {
          const aHas = hasValidPrice(a), bHas = hasValidPrice(b);
          if (!aHas && bHas) return 1;
          if (aHas && !bHas) return -1;
          if (!aHas && !bHas) return 0;
          return priceA - priceB;
        }
        case "priceDesc": {
          const aHas = hasValidPrice(a), bHas = hasValidPrice(b);
          if (!aHas && bHas) return 1;
          if (aHas && !bHas) return -1;
          if (!aHas && !bHas) return 0;
          return priceB - priceA;
        }
        case "ratingDesc": {
          const aMiss = ratingA <= 0, bMiss = ratingB <= 0;
          if (aMiss && !bMiss) return 1;
          if (!aMiss && bMiss) return -1;
          return ratingB - ratingA;
        }
        case "reco":
        default: {
          const psA = hasValidPrice(a) ? -priceA * 0.01 : 0;
          const psB = hasValidPrice(b) ? -priceB * 0.01 : 0;
          const scoreA = ratingA * 1000 + psA;
          const scoreB = ratingB * 1000 + psB;
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

  // ===== 카드 렌더 =====
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

      // 가격 (rooms 최저가 병합으로 대부분 표시됨)
      const itemHasPrice = hasValidPrice(item);
      const priceNum = getPrice(item);

      // 이미지 (로컬 폴백 포함)
      const slug = toSlug(name);
      const localFallback = LOCAL_FALLBACKS[slug];
      const imageUrl =
        item.image ||
        item.thumbnailUrl ||
        item.imageUrl ||
        item.mainImageUrl ||
        item.firstImageUrl ||
        (Array.isArray(item.images) && item.images[0]) ||
        localFallback ||
        "";

      // ✨ 포커스 좌표(없으면 중앙)
      const focus = FOCUS_MAP[slug] || { x: "50%", y: "50%" };

      const wished = isFavorite(idNum);

      const handleCardClick = () => {
        if (!disabled) navigate(`/accommodations/detail/${idNum}`);
      };

      const handleFavoriteClick = (e) => {
        e.stopPropagation();
        if (disabled) return;
        // 가격/이미지/위치 포함 저장
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
          {/* ✅ 썸네일 (이미지 꽉 + 위치 정확 제어: --obj-x/--obj-y) */}
          <div
            className="srch-thumb"
            style={{ '--obj-x': '60%', '--obj-y': '40%' }}
          >
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

            {/* ✅ 가격: 항상 노출 시도 (없으면 '가격 문의') */}
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

  return (
    <div className="jeju-page">
      {/* 헤더 */}
      <div className="jeju-header">
        <div className="jeju-header-inner">
          <h1>
            '부산' 숙소 검색 결과
            <span>{total.toLocaleString()}개</span>
          </h1>

          <div className="jeju-sort">
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="정렬 기준">
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

            {!loading && pageItems.length === 0 && !errMsg && (
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