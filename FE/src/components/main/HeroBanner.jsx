import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout/HeroBanner.css";

import bg1 from "../../assets/images/Main/나이아가라강.jpg";
import bg2 from "../../assets/images/Main/몽블랑.jpg";
import bg3 from "../../assets/images/Main/제주도.jpg";
import bg4 from "../../assets/images/Main/두바이.jpg";

const BANNER_DATA = [
  {
    id: 1,
    image: bg1,
    text: "웅장한 나이아가라 폭포의 감동",
    subtitle: "자연이 빚어낸 최고의 장관",
    alt: "나이아가라 폭포"
  },
  {
    id: 2,
    image: bg2,
    text: "몽블랑 설산이 선사하는 휴식",
    subtitle: "순백의 설경 속으로 떠나보세요",
    alt: "몽블랑"
  },
  {
    id: 3,
    image: bg3,
    text: "제주의 푸른 바다와 함께",
    subtitle: "에메랄드빛 휴양지에서의 특별한 시간",
    alt: "제주도 바다"
  },
  {
    id: 4,
    image: bg4,
    text: "사막의 도시, 두바이의 야경",
    subtitle: "이국적인 매력을 경험하세요",
    alt: "두바이 스카이라인"
  },
];

const TABS = [
  { key: "domestic", label: "국내 숙소", placeholder: "여행지나 숙소를 검색해보세요." },
  { key: "overseas", label: "해외 숙소", placeholder: "도시/국가를 검색해보세요." },
  { key: "package", label: "액티비티", placeholder: "도시/테마를 검색해보세요." },
];

const GUEST_LIMITS = { MIN: 1, MAX: 10 };
const SLIDE_INTERVAL = 6000;

export default function HeroBanner() {
  const navigate = useNavigate(); // ✅ 라우팅 훅

  const [currentIndex, setCurrentIndex] = useState(0);
  const [tab, setTab] = useState(TABS[0].key);

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComposing, setIsComposing] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // 자동 슬라이드
  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setCurrentIndex((c) => (c + 1) % BANNER_DATA.length);
          return 0;
        }
        return p + 100 / (SLIDE_INTERVAL / 100);
      });
    }, 100);
    return () => clearInterval(t);
  }, []);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return "";
    const ci = new Date(checkIn), co = new Date(checkOut);
    const diff = Math.max(0, Math.round((co - ci) / (1000 * 60 * 60 * 24)));
    return diff > 0 ? ` (${diff}박)` : "";
  }, [checkIn, checkOut]);

  const fmt = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    const w = ["일", "월", "화", "수", "목", "금", "토"][dt.getDay()];
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${mm}.${dd} ${w}`;
  };

  const validate = useCallback(() => {
    if (!destination.trim()) return "여행지/숙소를 입력해주세요.";
    if (!checkIn) return "체크인 날짜를 선택해주세요.";
    if (!checkOut) return "체크아웃 날짜를 선택해주세요.";
    const ci = new Date(checkIn), co = new Date(checkOut), t = new Date(today);
    if (ci < new Date(t.toDateString())) return "체크인은 오늘 이후여야 합니다.";
    if (co <= ci) return "체크아웃은 체크인 이후여야 합니다.";
    return null;
  }, [destination, checkIn, checkOut, today]);

  // ✅ 검색 → 링크 이동
  const search = async (e) => {
    if (e) e.preventDefault(); // 폼 submit 기본동작 방지
    const err = validate();
    if (err) return alert(err);
    setIsSearching(true);
    try {
      const params = new URLSearchParams({
        tab,
        q: destination.trim(),
        checkIn,
        checkOut,
        guests: String(guests),
      });
      // 예시: /search?tab=domestic&q=제주&checkIn=2025-08-15&checkOut=2025-08-17&guests=2
      navigate(`/search?${params.toString()}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePrev = () => { setCurrentIndex((i) => (i - 1 + BANNER_DATA.length) % BANNER_DATA.length); setProgress(0); };
  const handleNext = () => { setCurrentIndex((i) => (i + 1) % BANNER_DATA.length); setProgress(0); };

  const currentBanner = BANNER_DATA[currentIndex];
  const placeholder = TABS.find(t => t.key === tab)?.placeholder ?? "검색어를 입력하세요.";

  const openPicker = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.showPicker) el.showPicker();
    else el.focus();
  };

  const onClickDateField = () => {
    if (!checkIn) openPicker("ci");
    else openPicker("co");
  };

  const onChangeCheckIn = (v) => {
    setCheckIn(v);
    const vDate = new Date(v);
    const coDate = checkOut ? new Date(checkOut) : null;
    if (!coDate || coDate <= vDate) {
      const next = new Date(vDate);
      next.setDate(next.getDate() + 1);
      const yyyy = next.getFullYear();
      const mm = String(next.getMonth() + 1).padStart(2, "0");
      const dd = String(next.getDate()).padStart(2, "0");
      setCheckOut(`${yyyy}-${mm}-${dd}`);
    }
    setTimeout(() => openPicker("co"), 0);
  };

  const dateLabel = checkIn && checkOut
    ? `${fmt(checkIn)} - ${fmt(checkOut)}${nights}`
    : "체크인 - 체크아웃";

  const handleTextKeyDown = (e) => {
    if (e.key === "Enter" && !isComposing && !isSearching) {
      e.preventDefault();
      search();
    }
  };

  return (
    <section className="hero hero--cover">
      {/* 배경 이미지 */}
      {BANNER_DATA.map((b, i) => (
        <div
          key={b.id}
          className={`hero__bg ${i === currentIndex ? "is-active" : ""}`}
          style={{ backgroundImage: `url(${b.image})` }}
          role="img"
          aria-label={b.alt}
        />
      ))}

      {/* 좌우 화살표 */}
      <button className="hero__arrow hero__arrow--left" onClick={handlePrev} aria-label="이전 슬라이드">
        <i className="bi bi-chevron-left" />
      </button>
      <button className="hero__arrow hero__arrow--right" onClick={handleNext} aria-label="다음 슬라이드">
        <i className="bi bi-chevron-right" />
      </button>

      {/* 텍스트/검색 카드 */}
      <div className="hero__inner">
        <h1 className="hero__title">{currentBanner.text}</h1>
        <p className="hero__subtitle">{currentBanner.subtitle}</p>

        {/* ✅ form 으로 감싸서 Enter/버튼 둘 다 submit */}
        <form className="search-card" onSubmit={search}>
          {/* 탭 */}
          <div className="search-card__tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                className={`tab ${tab === t.key ? "is-active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 입력 */}
          <div className="search-card__fields">
            {/* 목적지 */}
            <div className="field field--text">
              <i className="bi bi-search" aria-hidden="true"></i>
              <input
                type="text"
                inputMode="search"
                placeholder={placeholder}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={handleTextKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                aria-label="여행지 또는 숙소 검색"
              />
              {destination && (
                <button
                  type="button"
                  className="field__clear"
                  aria-label="입력 지우기"
                  onClick={() => setDestination("")}
                >
                  <i className="bi bi-x-lg" />
                </button>
              )}
            </div>

            {/* 날짜 */}
            <div
              className="field field--date field--clickable"
              onClick={onClickDateField}
              aria-label="체크인과 체크아웃 날짜 선택"
            >
              <i className="bi bi-calendar2"></i>
              <span className={`field__display ${(!checkIn || !checkOut) ? "is-placeholder" : ""}`}>
                {dateLabel}
              </span>
              <input
                id="ci"
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => onChangeCheckIn(e.target.value)}
              />
              <input
                id="co"
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            {/* 인원 */}
            <div className="field field--clickable">
              <i className="bi bi-person"></i>
              <span className="field__display">{`인원 ${guests}`}</span>
              <div className="field__counter">
                <button
                  type="button"
                  onClick={() => setGuests((v) => Math.max(GUEST_LIMITS.MIN, v - 1))}
                  disabled={guests <= GUEST_LIMITS.MIN}
                  aria-label="인원 줄이기"
                >
                  <i className="bi bi-dash"></i>
                </button>
                <button
                  type="button"
                  onClick={() => setGuests((v) => Math.min(GUEST_LIMITS.MAX, v + 1))}
                  disabled={guests >= GUEST_LIMITS.MAX}
                  aria-label="인원 늘리기"
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>

            {/* 버튼 */}
            <button className="search-btn" type="submit" disabled={isSearching}>
              {isSearching ? "검색 중..." : "검색"}
            </button>
          </div>
        </form>

        {/* 하단 진행바 */}
        <div className="hero__progress">
          <div style={{ width: `${(currentIndex * 100 + progress) / BANNER_DATA.length}%` }} />
        </div>
      </div>
    </section>
  );
}
