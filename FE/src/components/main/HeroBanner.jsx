import React, { useEffect, useState, useCallback, useMemo } from "react";
import "../../styles/layout/HeroBanner.css";

import bg2 from "../../assets/images/Main/몽블랑.jpg";
import bg3 from "../../assets/images/Main/제주도.jpg";
import bg4 from "../../assets/images/Main/두바이.jpg";

const BANNER_DATA = [
  { id: 2, image: bg2, text: "몽블랑의 설경 속에서", alt: "몽블랑 설경" },
  { id: 3, image: bg3, text: "제주의 푸른 바다", alt: "제주 해안" },
  { id: 4, image: bg4, text: "두바이의 사막 위에", alt: "두바이 도시" },
];

const GUEST_LIMITS = { MIN: 1, MAX: 10 };
const SLIDE_INTERVAL = 5000;

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [activeTab, setActiveTab] = useState("domestic");
  const [isSearching, setIsSearching] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNER_DATA.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const validateSearch = useCallback(() => {
    if (!destination.trim())
      return { isValid: false, message: "여행지를 입력해주세요." };
    if (!checkIn)
      return { isValid: false, message: "체크인 날짜를 선택해주세요." };
    if (!checkOut)
      return { isValid: false, message: "체크아웃 날짜를 선택해주세요." };

    const todayDate = new Date(today);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < todayDate)
      return { isValid: false, message: "체크인은 오늘 이후여야 합니다." };
    if (checkOutDate <= checkInDate)
      return {
        isValid: false,
        message: "체크아웃 날짜는 체크인 이후여야 합니다.",
      };

    return { isValid: true };
  }, [destination, checkIn, checkOut, today]);

  const handleSearch = useCallback(async () => {
    const validation = validateSearch();
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setIsSearching(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(
        `검색 완료!\n여행지: ${destination}\n체크인: ${checkIn}\n체크아웃: ${checkOut}\n인원: ${guests}`
      );
    } catch (error) {
      console.error("검색 중 오류:", error);
      alert("검색 중 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
    }
  }, [validateSearch, destination, checkIn, checkOut, guests]);

  const handleGuestChange = useCallback((diff) => {
    setGuests((prev) =>
      Math.max(GUEST_LIMITS.MIN, Math.min(GUEST_LIMITS.MAX, prev + diff))
    );
  }, []);

  const handleSlideChange = useCallback((index) => setCurrentIndex(index), []);
  const handleTabChange = useCallback((tab) => setActiveTab(tab), []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !isSearching) handleSearch();
    },
    [handleSearch, isSearching]
  );

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

          <div className="search-box glass-effect" onKeyDown={handleKeyPress}>
            {/* 탭 버튼 */}
            <div className="tab-buttons" role="tablist">
              {["domestic", "overseas", "activity"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  role="tab"
                  aria-selected={activeTab === tab}
                >
                  {tab === "domestic" && "국내 숙소"}
                  {tab === "overseas" && "해외 숙소"}
                </button>
              ))}
            </div>

            {/* 검색 필드 */}
            <div className="search-fields" role="tabpanel">
              <div className="input-with-icon">
                <i className="bi bi-search" />
                <input
                  type="text"
                  placeholder="여행지를 입력해주세요"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  disabled={isSearching}
                />
              </div>
              <div className="input-with-icon">
                <i className="bi bi-calendar-check" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={today}
                  disabled={isSearching}
                />
              </div>
              <div className="input-with-icon">
                <i className="bi bi-calendar-x" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || today}
                  disabled={isSearching}
                />
              </div>
              <div className="input-with-icon guest-selector">
                <i className="bi bi-people" />
                <div className="guest-controls">
                  <button
                    onClick={() => handleGuestChange(-1)}
                    disabled={guests <= GUEST_LIMITS.MIN || isSearching}
                  >
                    <i className="bi bi-dash" />
                  </button>
                  <input
                    type="number"
                    value={guests}
                    readOnly
                    className="guest-input"
                  />
                  <button
                    onClick={() => handleGuestChange(1)}
                    disabled={guests >= GUEST_LIMITS.MAX || isSearching}
                  >
                    <i className="bi bi-plus" />
                  </button>
                </div>
              </div>
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? "검색 중..." : "검색"}
              </button>
            </div>
          </div>

          {/* 인디케이터 */}
          <div className="slide-indicators">
            {BANNER_DATA.map((banner, idx) => (
              <button
                key={banner.id}
                className={`indicator ${idx === currentIndex ? "active" : ""}`}
                onClick={() => handleSlideChange(idx)}
                aria-label={`${banner.text} 배너로 이동`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
