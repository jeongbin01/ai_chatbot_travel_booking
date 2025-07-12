import React, { useState } from 'react';
import '../../styles/layout/HeroBanner.css';
import bgImage from '../../assets/images/나이아가라강.jpg';

function HeroBanner() {
  const [activeTab, setActiveTab] = useState('domestic');

  const handleSearch = () => {
    console.log('검색 실행');
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
              여수 풀빌라부터 발리 리조트까지,<br />
              여행할땐 여기어때
            </h1>
          </div>

          <div className="search-box">
            <div className="tab-buttons" role="tablist">
              <button
                className={activeTab === 'domestic' ? 'active' : ''}
                onClick={() => setActiveTab('domestic')}
                role="tab"
                aria-selected={activeTab === 'domestic'}
              >
                국내 숙소
              </button>
              <button
                className={activeTab === 'overseas' ? 'active' : ''}
                onClick={() => setActiveTab('overseas')}
                role="tab"
                aria-selected={activeTab === 'overseas'}
              >
                해외 숙소
              </button>
            </div>

            <div className="search-fields">
              <div className="input-with-icon">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="여행지나 숙소를 검색해보세요."
                  aria-label="여행지 또는 숙소 검색"
                />
              </div>
              <div className="input-with-icon">
                <i className="bi bi-calendar-event"></i>
                <input
                  type="text"
                  value="07.12 토 - 07.13 일 (1박)"
                  readOnly
                  aria-label="체크인 체크아웃 날짜"
                  tabIndex={0}
                />
              </div>
              <div className="input-with-icon">
                <i className="bi bi-person"></i>
                <input
                  type="text"
                  value="인원 2"
                  readOnly
                  aria-label="투숙 인원"
                  tabIndex={0}
                />
              </div>
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
