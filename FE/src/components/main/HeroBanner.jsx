import React, { useEffect, useState, useCallback, useMemo } from "react";
import "../../styles/layout/HeroBanner.css";

import bg1 from "../../assets/images/Main/나이아가라강.jpg";
import bg2 from "../../assets/images/Main/몽블랑.jpg";
import bg3 from "../../assets/images/Main/제주도.jpg";
import bg4 from "../../assets/images/Main/두바이.jpg";

const BANNER_DATA = [
  { id: 1, image: bg1, text: "나이아가라의 물안개 속으로", subtitle: "자연의 웅장함을 느껴보세요", alt: "나이아가라 폭포" },
  { id: 2, image: bg2, text: "몽블랑의 설경 속에서", subtitle: "알프스의 순백을 만나다", alt: "몽블랑 설경" },
  { id: 3, image: bg3, text: "제주의 푸른 바다", subtitle: "청명한 제주 해안", alt: "제주 해안" },
  { id: 4, image: bg4, text: "두바이의 사막 위에", subtitle: "이국적인 도심의 야경", alt: "두바이 도시" },
];

const GUEST_LIMITS = { MIN: 1, MAX: 10 };
const SLIDE_INTERVAL = 6000;

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [isSearching, setIsSearching] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((c) => (c + 1) % BANNER_DATA.length);
          return 0;
        }
        return prev + 100 / (SLIDE_INTERVAL / 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const validateSearch = useCallback(() => {
    if (!destination.trim()) return { isValid: false, message: "여행지를 입력해주세요." };
    if (!checkIn) return { isValid: false, message: "체크인 날짜를 선택해주세요." };
    if (!checkOut) return { isValid: false, message: "체크아웃 날짜를 선택해주세요." };
    const t = new Date(today), ci = new Date(checkIn), co = new Date(checkOut);
    if (ci < t) return { isValid: false, message: "체크인은 오늘 이후여야 합니다." };
    if (co <= ci) return { isValid: false, message: "체크아웃 날짜는 체크인 이후여야 합니다." };
    return { isValid: true };
  }, [destination, checkIn, checkOut, today]);

  const handleSearch = useCallback(async () => {
    const v = validateSearch();
    if (!v.isValid) return alert(v.message);
    setIsSearching(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      alert(`검색 완료!\n여행지: ${destination}\n체크인: ${checkIn}\n체크아웃: ${checkOut}\n인원: ${guests}명`);
    } catch {
      alert("검색 중 오류 발생");
    } finally {
      setIsSearching(false);
    }
  }, [validateSearch, destination, checkIn, checkOut, guests]);

  const handleGuestChange = useCallback((diff) => {
    setGuests((p) => Math.max(GUEST_LIMITS.MIN, Math.min(GUEST_LIMITS.MAX, p + diff)));
  }, []);

  const handleSlideChange = useCallback((index) => {
    setCurrentIndex(index);
    setProgress(0);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !isSearching) handleSearch();
  }, [handleSearch, isSearching]);

  const nextSlide = () => handleSlideChange((currentIndex + 1) % BANNER_DATA.length);
  const prevSlide = () => handleSlideChange((currentIndex - 1 + BANNER_DATA.length) % BANNER_DATA.length);
  const currentBanner = BANNER_DATA[currentIndex];

  return (
    <section className="hero-banner">
      {BANNER_DATA.map((banner, index) => (
        <div
          key={banner.id}
          className={`hero-banner__background ${index === currentIndex ? "hero-banner__background--active" : ""}`}
          style={{ backgroundImage: `url(${banner.image})` }}
          role="img"
          aria-label={banner.alt}
        />
      ))}
      <button className="hero-banner__nav hero-banner__nav--prev" onClick={prevSlide} aria-label="이전 이미지">
        <i className="bi bi-chevron-left" />
      </button>
      <button className="hero-banner__nav hero-banner__nav--next" onClick={nextSlide} aria-label="다음 이미지">
        <i className="bi bi-chevron-right" />
      </button>
      <div className="hero-banner__overlay">
        <div className="hero-banner__text">
          <h1 className="hero-banner__title">{currentBanner.text}</h1>
          <p className="hero-banner__subtitle">{currentBanner.subtitle}</p>
          <p className="hero-banner__description">특별한 여행을 시작하세요</p>
        </div>

        {/* ✅ 검색 필드 */}
        <div className="hero-banner__search hero-banner__search--glass" onKeyDown={handleKeyPress}>
          <input
            type="text"
            placeholder="여행지를 입력하세요"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
          />
          <div className="guest-count">
            <button onClick={() => handleGuestChange(-1)} disabled={guests <= GUEST_LIMITS.MIN}>–</button>
            <span>{guests}명</span>
            <button onClick={() => handleGuestChange(1)} disabled={guests >= GUEST_LIMITS.MAX}>＋</button>
          </div>
          <button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? "검색 중..." : "검색"}
          </button>
        </div>

        {/* 슬라이드 인디케이터 */}
        <div className="hero-banner__indicators">
          {BANNER_DATA.map((_, idx) => (
            <button
              key={idx}
              className={`hero-banner__indicator ${idx === currentIndex ? "hero-banner__indicator--active" : ""}`}
              onClick={() => handleSlideChange(idx)}
              aria-label={`${BANNER_DATA[idx].text} 배너로 이동`}
            >
              <div
                className="hero-banner__indicator-progress"
                style={{ width: idx === currentIndex ? `${progress}%` : "0%" }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="hero-banner__progress-bar">
        <div
          className="hero-banner__progress-fill"
          style={{ width: `${(currentIndex * 100 + progress) / BANNER_DATA.length}%` }}
        />
      </div>
    </section>
  );
}