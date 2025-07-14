import React, { useState } from "react";
import "../../styles/layout/HeroBanner.css";
import bgImage from "../../assets/images/나이아가라강.jpg";

function HeroBanner() {
  const [activeTab, setActiveTab] = useState("domestic");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    console.log("검색 실행");
    console.log("체크인:", checkIn, "체크아웃:", checkOut, "인원:", guests);
  };

  return (
    <section className="hero-banner">
      <div
        className="hero-background"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="hero-overlay">
          <div className="hero-text">
            <h1>
              나이아가라의 물안개 속으로,<br />
              잊지 못할 여행
            </h1>
          </div>

          <div className="search-box">
            <div className="tab-buttons" role="tablist">
              <button
                className={activeTab === "domestic" ? "active" : ""}
                onClick={() => setActiveTab("domestic")}
                role="tab"
              >
                국내 숙소
              </button>
              <button
                className={activeTab === "overseas" ? "active" : ""}
                onClick={() => setActiveTab("overseas")}
                role="tab"
              >
                해외 숙소
              </button>
            </div>

            <div className="search-fields">
              {/* 여행지 검색 */}
              <div className="input-with-icon">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="여행지나 숙소를 검색해보세요."
                />
              </div>

              {/* 체크인 날짜 */}
              <div className="input-with-icon">
                <i className="bi bi-calendar-check"></i>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  aria-label="체크인 날짜"
                />
              </div>

              {/* 체크아웃 날짜 */}
              <div className="input-with-icon">
                <i className="bi bi-calendar-x"></i>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  aria-label="체크아웃 날짜"
                />
              </div>

              {/* 인원수 선택 */}
              <div className="input-with-icon guest-selector">
                <i className="bi bi-people"></i>
                <div className="guest-controls">
                  <button
                    onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                    type="button"
                    aria-label="인원 감소"
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <span>인원 {guests}</span>
                  <button
                    onClick={() => setGuests((prev) => prev + 1)}
                    type="button"
                    aria-label="인원 증가"
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
}

export default HeroBanner;