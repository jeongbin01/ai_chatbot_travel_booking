import React, { useEffect, useState } from "react";
import "../../styles/layout/HeroBanner.css";

import bg1 from "../../assets/images/Main/나이아가라강.jpg";
import bg2 from "../../assets/images/Main/나이아가라강.jpg";
import bg3 from "../../assets/images/Main/나이아가라강.jpg";
import bg4 from "../../assets/images/Main/나이아가라강.jpg";

const bannerData = [
  {
    image: bg1,
    text: "나이아가라의 물안개 속으로,<br/>잊지 못할 여행",
  },
  {
    image: bg2,
    text: "몽블랑의 설경 속에서,<br/>당신만의 여정을",
  },
  {
    image: bg3,
    text: "제주의 푸른 바다,<br/>마음까지 시원해지는 여행",
  },
  {
    image: bg4,
    text: "두바이의 사막 위에,<br/>럭셔리한 순간을",
  },
];

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("domestic");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [destination, setDestination] = useState("");

  // 자동 슬라이드 (5초마다 배경 변경)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 현재 배너 데이터 안전하게 가져오기
  const currentBanner = bannerData[currentIndex] || bannerData[0];
  const { image, text } = currentBanner;

  const handleSearch = () => {
    // 입력값 검증
    if (!destination.trim()) {
      alert("여행지나 숙소를 입력해주세요.");
      return;
    }
    
    if (!checkIn) {
      alert("체크인 날짜를 선택해주세요.");
      return;
    }
    
    if (!checkOut) {
      alert("체크아웃 날짜를 선택해주세요.");
      return;
    }
    
    // 날짜 검증
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
      alert("체크인 날짜는 오늘 이후여야 합니다.");
      return;
    }
    
    if (checkOutDate <= checkInDate) {
      alert("체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.");
      return;
    }
    
    console.log("검색 실행");
    console.log({
      destination,
      checkIn,
      checkOut,
      guests,
      activeTab
    });
  };

  const handleGuestChange = (increment) => {
    setGuests(prev => {
      const newValue = prev + increment;
      return newValue < 1 ? 1 : newValue > 10 ? 10 : newValue;
    });
  };

  return (
    <section className="hero-banner">
      <div
        className="hero-background"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="hero-overlay">
          {/* 텍스트 */}
          <div className="hero-text">
            <h1 dangerouslySetInnerHTML={{ __html: text }} />
          </div>

          {/* 검색박스 */}
          <div className="search-box">
            {/* 탭 */}
            <div className="tab-buttons" role="tablist">
              <button
                className={activeTab === "domestic" ? "active" : ""}
                onClick={() => setActiveTab("domestic")}
                role="tab"
                aria-selected={activeTab === "domestic"}
              >
                국내 숙소
              </button>
              <button
                className={activeTab === "overseas" ? "active" : ""}
                onClick={() => setActiveTab("overseas")}
                role="tab"
                aria-selected={activeTab === "overseas"}
              >
                해외 숙소
              </button>
            </div>

            {/* 검색 필드 */}
            <div className="search-fields">
              {/* 여행지 검색 */}
              <div className="input-with-icon">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="여행지나 숙소를 검색해보세요."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  aria-label="여행지 검색"
                />
              </div>

              {/* 체크인 */}
              <div className="input-with-icon">
                <i className="bi bi-calendar-check"></i>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  aria-label="체크인 날짜"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* 체크아웃 */}
              <div className="input-with-icon">
                <i className="bi bi-calendar-x"></i>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  aria-label="체크아웃 날짜"
                  min={checkIn || new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* 인원 */}
              <div className="input-with-icon guest-selector">
                <i className="bi bi-people"></i>
                <div className="guest-controls">
                  <button
                    onClick={() => handleGuestChange(-1)}
                    type="button"
                    aria-label="인원 감소"
                    disabled={guests <= 1}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <span>인원 {guests}</span>
                  <button
                    onClick={() => handleGuestChange(1)}
                    type="button"
                    aria-label="인원 증가"
                    disabled={guests >= 10}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>

              {/* 검색 버튼 */}
              <button
                className="search-btn"
                onClick={handleSearch}
                aria-label="숙소 검색하기"
              >
                <i className="bi bi-search"></i> 검색
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;