// src/pages/search/SearchPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AxiosClient } from "../../api/AxiosController";
import "../../styles/layout/SearchPage.css";

const PAGE_SIZE = 10;
const TYPES = ["전체", "모텔", "호텔·리조트", "펜션", "홈앤빌라", "캠핑", "게하·한옥"];
const SORTS = [
  { key: "reco", label: "추천순" },
  { key: "priceAsc", label: "낮은 가격순" },
  { key: "priceDesc", label: "높은 가격순" },
  { key: "ratingDesc", label: "평점순" },
];

export default function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

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

  // 필터 상태
  const [type, setType] = useState("전체");
  const [excludeSoldout, setExcludeSoldout] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("reco");
  const [page, setPage] = useState(1);

  const tabLabel =
    tab === "domestic" ? "국내 숙소" :
    tab === "overseas" ? "해외 숙소" :
    tab === "package" ? "패키지 여행" : "전체";

  // 데이터 로드
  useEffect(() => {
    let cancel = false;
    async function run() {
      setLoading(true);
      setErrMsg("");
      try {
        if (tab === "package") {
          setItems([]); // 패키지는 추후
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

          // ⭐ 정규화: id가 없으면 accommodationId를 id로 복사
          const normalized = raw.map((i) => ({
            ...i,
            id: i.id ?? i.accommodationId ?? i.accommodation_id, // 리스트에서 공통 키로 사용
          }));

          if (!cancel) setItems(normalized);
        }
      } catch (e) {
        console.error(e);
        if (!cancel) setErrMsg("검색 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
      } finally {
        if (!cancel) setLoading(false);
      }
    }
    run();
    return () => { cancel = true; };
  }, [tab, q, checkIn, checkOut, guests]);

  // 가격 최소/최대값을 데이터 기준으로 보정
  const priceRange = useMemo(() => {
    const prices = (items || [])
      .map(i => i.basePrice ?? i.price ?? i.minPrice)
      .filter(p => typeof p === "number");
    if (prices.length === 0) return { lo: 0, hi: 500000 };
    const lo = Math.min(...prices);
    const hi = Math.max(...prices);
    return { lo, hi };
  }, [items]);

  useEffect(() => {
    // 데이터 바뀌면 범위를 데이터에 맞게 초기화
    setMinPrice(priceRange.lo);
    setMaxPrice(priceRange.hi);
    setPage(1);
  }, [priceRange.lo, priceRange.hi]);

  // 필터+정렬 결과
  const processed = useMemo(() => {
    let list = [...items];

    // 1) 텍스트 검색(백엔드가 q 처리를 못할 경우 대비)
    if (q.trim()) {
      const k = q.trim().toLowerCase();
      list = list.filter(i =>
        (i.name || "").toLowerCase().includes(k) ||
        (i.location || "").toLowerCase().includes(k) ||
        (i.description || "").toLowerCase().includes(k)
      );
    }

    // 2) 숙소유형
    if (type !== "전체") {
      list = list.filter(i => (i.accommodationType || i.type || "").includes(type));
    }

    // 3) 매진 제외
    if (excludeSoldout) {
      list = list.filter(i => (i.soldout === true ? false : true));
    }

    // 4) 가격 범위
    list = list.filter(i => {
      const price = i.basePrice ?? i.price ?? i.minPrice ?? 0;
      return price >= minPrice && price <= maxPrice;
    });

    // 5) 평점 하한
    list = list.filter(i => {
      const rating = i.averageRating ?? i.rating ?? 0;
      return (rating || 0) >= minRating;
    });

    // 6) 정렬
    list.sort((a, b) => {
      const pa = a.basePrice ?? a.price ?? a.minPrice ?? 0;
      const pb = b.basePrice ?? b.price ?? b.minPrice ?? 0;
      const ra = a.averageRating ?? a.rating ?? 0;
      const rb = b.averageRating ?? b.rating ?? 0;

      switch (sort) {
        case "priceAsc":  return pa - pb;
        case "priceDesc": return pb - pa;
        case "ratingDesc":return rb - ra;
        default:          return 0; // 추천순: 그대로
      }
    });

    return list;
  }, [items, q, type, excludeSoldout, minPrice, maxPrice, minRating, sort]);

  // 페이지네이션
  const total = processed.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return processed.slice(start, start + PAGE_SIZE);
  }, [processed, page]);

  const renderCard = (i) => {
    // ✅ 실제 상세 API가 요구하는 정수 ID 확보
    const accId = i.accommodationId ?? i.id ?? i.accommodation_id;
    const idNum = Number(accId); // 숫자만 허용
    const disabled = Number.isNaN(idNum);

    const name = i.name ?? "이름 미정";
    const loc = i.location ?? "";
    const rating = i.averageRating ?? i.rating ?? null;
    const price = i.basePrice ?? i.price ?? i.minPrice ?? null;
    const img =
      i.thumbnailUrl ||
      i.image ||
      (Array.isArray(i.images) ? i.images[0] : "") ||
      "/images/no-image.png";

    return (
      <article
        key={accId ?? Math.random().toString(36).slice(2)}
        className={`srch-item ${disabled ? "is-disabled" : ""}`}
        role="button"
        onClick={() => {
          if (disabled) return;         // 잘못된 id면 이동 방지
          navigate(`/accommodations1/${idNum}`);
        }}
        aria-disabled={disabled}
        title={disabled ? "상세 정보가 없는 항목입니다." : name}
      >
        <div className="srch-thumb" style={{ backgroundImage: `url(${img})` }} />
        <div className="srch-meta">
          <div className="srch-title">{name}</div>
          <div className="srch-sub">
            <span>{loc}</span>
            {rating ? <span className="dot">·</span> : null}
            {rating ? <span>평점 {rating}</span> : null}
          </div>
          {price
            ? <div className="srch-price">₩{price.toLocaleString()}</div>
            : <div className="srch-price">가격 문의</div>}
        </div>
      </article>
    );
  };

  return (
    <main className="srch">
      {/* 헤더 */}
      <header className="srch-head">
        <h1>{`'${q || "전체"}' 검색 결과`}</h1>
        <div className="srch-conds">
          <span>{tabLabel}</span>
          <span className="sep">|</span>
          <span>{checkIn && checkOut ? `${checkIn} ~ ${checkOut}` : "기간 선택 없음"}</span>
          <span className="sep">|</span>
          <span>인원 {guests}명</span>
          <span className="sep">|</span>
          <span>총 {total}개</span>
        </div>
        {/* 정렬 */}
        <div className="srch-sort">
          <label htmlFor="sort">정렬</label>
          <select
            id="sort"
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
          >
            {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </header>

      <div className="srch-body">
        {/* ----- 필터 사이드 ----- */}
        <aside className="srch-filter">
          <button
            className="reset"
            onClick={() => {
              setType("전체");
              setExcludeSoldout(false);
              setMinPrice(priceRange.lo);
              setMaxPrice(priceRange.hi);
              setMinRating(0);
              setSort("reco");
              setPage(1);
            }}
          >
            초기화
          </button>

          <div className="flt-group">
            <div className="flt-title">매진 숙소 제외</div>
            <label className="chk">
              <input
                type="checkbox"
                checked={excludeSoldout}
                onChange={e => { setExcludeSoldout(e.target.checked); setPage(1); }}
              />
              <span>매진 제외</span>
            </label>
          </div>

          <div className="flt-group">
            <div className="flt-title">숙소 유형</div>
            <div className="types">
              {TYPES.map(t => (
                <label key={t} className={`pill ${type === t ? "is-active" : ""}`}>
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={type === t}
                    onChange={() => { setType(t); setPage(1); }}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flt-group">
            <div className="flt-title">가격 (1박)</div>
            <div className="price-row">
              <input
                type="number"
                value={minPrice}
                min={priceRange.lo}
                max={maxPrice}
                onChange={e => { setMinPrice(Number(e.target.value)); setPage(1); }}
              />
              <span className="tilde">~</span>
              <input
                type="number"
                value={maxPrice}
                min={minPrice}
                max={priceRange.hi}
                onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1); }}
              />
            </div>
            <div className="hint">
              {priceRange.lo.toLocaleString()}원 ~ {priceRange.hi.toLocaleString()}원
            </div>
          </div>

          <div className="flt-group">
            <div className="flt-title">최소 평점</div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={minRating}
              onChange={e => { setMinRating(Number(e.target.value)); setPage(1); }}
            />
            <div className="hint">{minRating} 이상</div>
          </div>
        </aside>

        {/* ----- 결과 리스트 ----- */}
        <section className="srch-list">
          {loading && (
            <div className="skeleton-wrap">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          )}

          {!loading && errMsg && <div className="status error">{errMsg}</div>}

          {!loading && !errMsg && pageItems.length === 0 && (
            <div className="status empty">조건에 맞는 결과가 없어요.</div>
          )}

          {!loading && !errMsg && pageItems.length > 0 && (
            <>
              <div className="grid">{pageItems.map(renderCard)}</div>

              {/* 페이지네이션 */}
              <div className="pager">
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>이전</button>
                <span>{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>다음</button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
