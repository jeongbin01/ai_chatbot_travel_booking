// src/pages/accommodations/SingaporeAccommodations.jsx
import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosClient } from "../../../api/AxiosController";
import "../../../styles/layout/Accommodations.css";
import useWishlistClient from "../../../hooks/useWishlistClient";

// ✅ 로컬 폴백 이미지
import IMG_SG_HOTEL from "../../../assets/images/overseas/싱가포르 호텔.jpg";

/* ====================== 상수/유틸 ====================== */
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
const toMoney = (n) => `${(Number(n) || 0).toLocaleString()}원`;
const unformatNumber = (s) => {
  const num = Number(String(s).replace(/[^0-9]/g, ""));
  return Number.isFinite(num) ? num : 0;
};

// '싱가포르' 포함 여부 (한/영 키워드)
const onlySingapore = (a) => {
  const text = `${a?.name ?? ""} ${a?.location ?? ""} ${a?.address ?? ""}`.toLowerCase();
  const keywords = [
    "싱가포르", "singapore", "sg",
    "마리나", "marina bay",
    "센토사", "sentosa",
    "차이나타운", "chinatown",
    "오차드", "orchard",
    "클락키", "clarke quay",
    "리틀인디아", "little india",
    "부기스", "bugis",
    "가든스", "gardens by the bay",
    "주롱", "jurong",
    "하버프론트", "harbourfront",
  ];
  return keywords.some((k) => text.includes(k));
};

// 이름 → 슬러그
const toSlug = (s) => String(s || "").replace(/[^가-힣a-zA-Z0-9]+/g, "").toLowerCase();

// 가격 추출/검사
const getPrice = (x = {}) => {
  const toNum = (v) => {
    if (v == null || v === "") return NaN;
    const str = String(v).replace(/[^0-9.]/g, "");
    const n = Number(str);
    return Number.isFinite(n) && n > 0 ? n : NaN;
  };
  const fields = [
    x.basePrice, x.price, x.minPrice, x.lowestPrice,
    x.roomPrice, x.nightPrice, x.defaultPrice,
    x.standardPrice, x.regularPrice, x.currentPrice,
    x.pricePerNight, x.cost, x.fee, x.amount,
  ];
  const valid = fields.map(toNum).filter((n) => Number.isFinite(n) && n > 0);
  return valid.length ? Math.min(...valid) : NaN;
};
const hasValidPrice = (x = {}) => {
  const fields = [
    x.basePrice, x.price, x.minPrice, x.lowestPrice,
    x.roomPrice, x.nightPrice, x.defaultPrice,
    x.standardPrice, x.regularPrice, x.currentPrice,
    x.pricePerNight, x.cost, x.fee, x.amount,
  ];
  return fields.some((v) => {
    if (v == null || v === "") return false;
    const n = Number(String(v).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) && n > 0;
  });
};

// ✅ 로컬 폴백 매핑
const LOCAL_FALLBACKS = {
  [toSlug("싱가포르 호텔")]: IMG_SG_HOTEL,
};

// ✅ 썸네일 포커스(없으면 중앙)
const FOCUS_MAP = {
  [toSlug("싱가포르 호텔")]: { x: "50%", y: "55%" },
};

/* ====================== 컴포넌트 ====================== */
export default function SingaporeAccommodations() {
  const navigate = useNavigate();
  const loaderRef = useRef(null);

  // 찜 훅
  const { isWished, toggleWish } = useWishlistClient();
  const isFavorite = useCallback((id) => isWished(id), [isWished]);

  // 상태
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [items, setItems] = useState([]);

  const [type, setType] = useState("전체");
  const [excludeSoldout, setExcludeSoldout] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("reco");

  const [minPriceStr, setMinPriceStr] = useState("0");
  const [maxPriceStr, setMaxPriceStr] = useState("500000");

  const [page, setPage] = useState(1);

  // ===== 데이터 로드 (싱가포르 + 해외 rooms 최저가 병합) =====
  const fetchSingapore = useCallback(async () => {
    setLoading(true);
    setErrMsg("");
    setPage(1);

    try {
      // 1) 싱가포르 숙소 목록
      const res = await AxiosClient("accommodations").get("", {
        params: { region: "싱가포르", location: "싱가포르", keyword: "싱가포르" },
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
      data = data.filter(onlySingapore);

      // 2) 해외 rooms에서 숙소별 최저가/첫 이미지 맵 (isDomestic: "N")
      const roomsRes = await AxiosClient("accommodations-rooms").get("", {
        params: { isDomestic: "N" },
      });
      const rooms = Array.isArray(roomsRes?.data) ? roomsRes.data : [];
      const PRICE_IDX = 22, ID_IDX = 0, IMG_IDX = 16;

      const minPriceMap = new Map();
      const firstImgMap = new Map();

      for (const row of rooms) {
        const accId = row?.[ID_IDX];
        const basePrice = Number(row?.[PRICE_IDX]);
        const img = row?.[IMG_IDX];

        if (accId == null) continue;
        if (Number.isFinite(basePrice)) {
          const prev = minPriceMap.get(accId);
          if (!Number.isFinite(prev) || basePrice < prev) minPriceMap.set(accId, basePrice);
        }
        if (img && !firstImgMap.has(accId)) firstImgMap.set(accId, img);
      }

      // 3) 병합
      const normalized = data.map((i) => {
        const id = i.id ?? i.accommodationId ?? i.accommodation_id;
        const merged = { ...i, id };

        if (!hasValidPrice(merged)) {
          const p = minPriceMap.get(id);
          if (Number.isFinite(p)) merged.basePrice = p;
        }
        if (!merged.image && !merged.thumbnailUrl && !merged.imageUrl) {
          const img = firstImgMap.get(id);
          if (img) merged.image = img;
        }
        return merged;
      });

      setItems(normalized);
    } catch (e) {
      console.error(e);
      setErrMsg("싱가포르 숙소를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSingapore();
  }, [fetchSingapore]);

  // 가격 범위 자동 설정
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

  useEffect(() => {
    setPage(1);
  }, [type, excludeSoldout, minPrice, maxPrice, minRating, sort]);

  // ===== 카드 렌더 =====
  const renderCard = useCallback(
    (item) => {
      const id = item.id ?? item.accommodationId ?? item.accommodation_id;
      const idNum = Number(id);
      const disabled = !id || isNaN(idNum);

      const name = item.name || "이름 미정";
      const location = item.location || item.address || "";

      const ratingRaw = item.averageRating ?? item.rating ?? item.ratingAvg;
      const ratingNum = Number.parseFloat(String(ratingRaw));
      const hasRatingVal = Number.isFinite(ratingNum) && ratingNum > 0;
      const displayRating = hasRatingVal ? ratingNum.toFixed(1) : null;

      const itemHasPrice = hasValidPrice(item);
      const priceNum = getPrice(item);

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

      const focus = FOCUS_MAP[slug] || { x: "50%", y: "50%" };
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
          <div className="srch-thumb" style={{ "--obj-x": focus.x, "--obj-y": focus.y }}>
            <img
              src={imageUrl || NO_IMAGE}
              alt={`${name} 이미지`}
              loading="lazy"
              onError={(e) => {
                if (!e.currentTarget.src.endsWith(NO_IMAGE)) e.currentTarget.src = NO_IMAGE;
              }}
            />
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

          <div className="srch-meta srch-meta--split">
            <div className="srch-info">
              <div className="srch-title" title={name}>{name}</div>
              {location && <div className="srch-loc" title={location}>{location}</div>}
              {hasRatingVal && (
                <div className="srch-rating">
                  <i className="bi bi-star-fill star" />
                  <span className="rating-score">{displayRating}</span>
                </div>
              )}
            </div>
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

  const processed = useMemo(() => {
    let list = [...items];

    if (type !== "전체") {
      list = list.filter((i) => (i.accommodationType || i.type || "").includes(type));
    }
    if (excludeSoldout) list = list.filter((i) => !i.soldout);

    list = list.filter((i) => {
      if (!hasValidPrice(i)) return true;
      const p = getPrice(i);
      return p >= minPrice && p <= maxPrice;
    });

    list = list.filter((i) => {
      const rating = Number(i?.averageRating ?? i?.rating ?? 0) || 0;
      return rating >= minRating;
    });

    const priceOf = (x) => getPrice(x);
    const ratingOf = (x) => Number(x?.averageRating ?? x?.rating ?? 0) || 0;

    list.sort((a, b) => {
      const pa = priceOf(a), pb = priceOf(b);
      const ra = ratingOf(a), rb = ratingOf(b);
      switch (sort) {
        case "priceAsc": {
          const aHas = hasValidPrice(a), bHas = hasValidPrice(b);
          if (!aHas && bHas) return 1;
          if (aHas && !bHas) return -1;
          if (!aHas && !bHas) return 0;
          return pa - pb;
        }
        case "priceDesc": {
          const aHas = hasValidPrice(a), bHas = hasValidPrice(b);
          if (!aHas && bHas) return 1;
          if (aHas && !bHas) return -1;
          if (!aHas && !bHas) return 0;
          return pb - pa;
        }
        case "ratingDesc": {
          const aMiss = ra <= 0, bMiss = rb <= 0;
          if (aMiss && !bMiss) return 1;
          if (!aMiss && bMiss) return -1;
          return rb - ra;
        }
        case "reco":
        default: {
          const psA = hasValidPrice(a) ? -pa * 0.01 : 0;
          const psB = hasValidPrice(b) ? -pb * 0.01 : 0;
          const sa = ra * 1000 + psA;
          const sb = rb * 1000 + psB;
          return sb - sa;
        }
      }
    });

    return list;
  }, [items, type, excludeSoldout, minPrice, maxPrice, minRating, sort]);

  const total = processed.length;
  const pageItems = useMemo(() => processed.slice(0, PAGE_SIZE * page), [processed, page]);

  // 무한 스크롤
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
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
    io.observe(el);
    return () => io.disconnect();
  }, [total, loading]);

  return (
    <div className="jeju-page">
      <div className="jeju-header">
        <div className="jeju-header-inner">
          <h1>
            '싱가포르' 숙소 검색 결과
            <span>{total.toLocaleString()}개</span>
          </h1>
          <div className="jeju-sort">
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="정렬 기준">
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
                  <input type="text" inputMode="numeric" pattern="[0-9,]*" value={minPriceStr} onChange={(e) => {
                    const next = clamp(unformatNumber(e.target.value), 0, maxPrice);
                    setMinPrice(next);
                    setMinPriceStr(next.toLocaleString());
                  }} />
                  <span>~</span>
                  <input type="text" inputMode="numeric" pattern="[0-9,]*" value={maxPriceStr} onChange={(e) => {
                    const next = Math.max(unformatNumber(e.target.value), minPrice);
                    setMaxPrice(next);
                    setMaxPriceStr(next.toLocaleString());
                  }} />
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

            {!loading && errMsg && <div className="status error" role="alert">{errMsg}</div>}

            {!loading && pageItems.length === 0 && !errMsg && (
              <div className="status empty">조건에 맞는 결과가 없어요.</div>
            )}

            {!loading && !errMsg && pageItems.length > 0 && (
              <>
                <div className="grid">{pageItems.map(renderCard)}</div>
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
