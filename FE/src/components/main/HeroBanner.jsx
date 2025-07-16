import React, { useEffect, useState, useCallback, useMemo } from "react";
import "../../styles/layout/HeroBanner.css";

import bg1 from "../../assets/images/Main/나이아가라강.jpg";
import bg2 from "../../assets/images/Main/몽블랑.jpg";
import bg3 from "../../assets/images/Main/제주도.jpg";
import bg4 from "../../assets/images/Main/두바이.jpg";

const BANNER_DATA = [
  {
    id: 1,
    image: bg1,
    text: "나이아가라의 물안개 속으로",
    alt: "나이아가라 폭포",
  },
  { id: 2, image: bg2, text: "몽블랑의 설경 속에서", alt: "몽블랑 설경" },
  { id: 3, image: bg3, text: "제주의 푸른 바다", alt: "제주 해안" },
  { id: 4, image: bg4, text: "두바이의 사막 위에", alt: "두바이 도시" },
];

const GUEST_LIMITS = {
  MIN: 1,
  MAX: 10,
};

const SLIDE_INTERVAL = 5000;

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [activeTab, setActiveTab] = useState("domestic");
  const [isSearching, setIsSearching] = useState(false);

  // 오늘 날짜 메모화
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // 슬라이드 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNER_DATA.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // 검색 유효성 검사
  const validateSearch = useCallback(() => {
    if (!destination.trim()) {
      return { isValid: false, message: "여행지를 입력해주세요." };
    }
    if (!checkIn) {
      return { isValid: false, message: "체크인 날짜를 선택해주세요." };
    }
    if (!checkOut) {
      return { isValid: false, message: "체크아웃 날짜를 선택해주세요." };
    }
    // '오늘' 날짜와 비교 시 자정 기준으로 인해 발생하는 문제를 피하기 위해 날짜만 비교
    const todayDateOnly = new Date(today);
    if (new Date(checkIn) < todayDateOnly) {
      return { isValid: false, message: "체크인은 오늘 이후여야 합니다." };
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      return {
        isValid: false,
        message: "체크아웃 날짜는 체크인 이후여야 합니다.",
      };
    }
    return { isValid: true };
  }, [destination, checkIn, checkOut, today]);

  // 검색 처리
  const handleSearch = useCallback(async () => {
    const validation = validateSearch();
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setIsSearching(true);
    try {
      // 실제 검색 로직 대신 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const searchParams = {
        destination,
        checkIn,
        checkOut,
        guests,
        type: activeTab,
      };

      console.log("검색 파라미터:", searchParams);
      alert(
        `검색 완료!\n여행지: ${destination}\n체크인: ${checkIn}\n체크아웃: ${checkOut}\n인원: ${guests}`
      );
    } catch (error) {
      console.error("검색 중 오류:", error);
      alert("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSearching(false);
    }
  }, [validateSearch, destination, checkIn, checkOut, guests, activeTab]);

  // 인원 수 변경
  const handleGuestChange = useCallback((diff) => {
    setGuests((prev) => {
      const newValue = prev + diff;
      return Math.max(GUEST_LIMITS.MIN, Math.min(GUEST_LIMITS.MAX, newValue));
    });
  }, []);

  // 슬라이드 인덱스 변경
  const handleSlideChange = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // 탭 변경
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // 엔터 키 처리
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !isSearching) {
        handleSearch();
      }
    },
    [handleSearch, isSearching]
  );

  // 현재 배너 데이터
  const currentBanner = BANNER_DATA[currentIndex];

  return (
    <section className="hero-banner">
      <div
        className="hero-background"
        style={{ backgroundImage: `url(${currentBanner.image})` }}
        role="img"
        aria-label={currentBanner.alt}
      >
        <div className="hero-overlay">
          <div className="hero-text">
            <h1>{currentBanner.text}</h1>
            <p>특별한 여행을 시작하세요</p>
          </div>

          <div className="search-box glass-effect">
            <div className="tab-buttons" role="tablist">
              <button
                className={activeTab === "domestic" ? "active" : ""}
                onClick={() => handleTabChange("domestic")}
                role="tab"
                aria-selected={activeTab === "domestic"}
                aria-controls="domestic-panel"
              >
                국내 숙소
              </button>
              <button
                className={activeTab === "overseas" ? "active" : ""}
                onClick={() => handleTabChange("overseas")}
                role="tab"
                aria-selected={activeTab === "overseas"}
                aria-controls="overseas-panel"
              >
                해외 숙소
              </button>
            </div>

            <div
              className="search-fields"
              role="tabpanel"
              id={`${activeTab}-panel`}
              onKeyPress={handleKeyPress}
            >
              <div className="input-with-icon">
                <i className="bi bi-search" aria-hidden="true"></i>
                <input
                  type="text"
                  placeholder="여행지나 숙소를 검색해보세요."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  aria-label="여행지 검색"
                  disabled={isSearching}
                />
              </div>

              {/* 체크인, 체크아웃 수정  */}
              <div className="input-with-icon">
                <i className="bi bi-calendar-check" aria-hidden="true"></i>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={today}
                  aria-label="체크인 날짜"
                  disabled={isSearching}
                />
              </div>

              <div className="input-with-icon">
                <i className="bi bi-calendar-x" aria-hidden="true"></i>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || today}
                  aria-label="체크아웃 날짜"
                  disabled={isSearching || !checkIn}
                />
              </div>

              <div className="input-with-icon guest-selector">
                <i className="bi bi-people" aria-hidden="true"></i>
                <div className="guest-controls">
                  <button
                    onClick={() => handleGuestChange(-1)}
                    disabled={guests <= GUEST_LIMITS.MIN || isSearching}
                    aria-label="인원 감소"
                    type="button"
                  >
                    <i className="bi bi-dash" aria-hidden="true"></i>
                  </button>
                  
                  {/* 인원 수 수정  */}
                  <label htmlFor="guests" className="sr-only">
                    인원 수
                  </label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    className="guest-input" // 스타일링을 위한 클래스 추가
                    min={GUEST_LIMITS.MIN}
                    max={GUEST_LIMITS.MAX}
                    value={guests}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value)) {
                        const clamped = Math.max(
                          GUEST_LIMITS.MIN,
                          Math.min(GUEST_LIMITS.MAX, value)
                        );
                        setGuests(clamped);
                      } else {
                         setGuests(GUEST_LIMITS.MIN); // 빈 값일 경우 최소값으로 설정
                      }
                    }}
                    disabled={isSearching}
                    aria-label="인원 수 입력"
                  />

                  <button
                    onClick={() => handleGuestChange(1)}
                    disabled={guests >= GUEST_LIMITS.MAX || isSearching}
                    aria-label="인원 증가"
                    type="button"
                  >
                    <i className="bi bi-plus" aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={isSearching}
                aria-label="숙소 검색"
              >
                {isSearching ? "검색 중..." : "검색"}
              </button>
            </div>
          </div>

          <div
            className="slide-indicators"
            role="tablist"
            aria-label="배너 슬라이드"
          >
            {BANNER_DATA.map((banner, idx) => (
              <button
                key={banner.id}
                className={`indicator ${idx === currentIndex ? "active" : ""}`}
                onClick={() => handleSlideChange(idx)}
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={`${banner.text} 슬라이드로 이동`}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;