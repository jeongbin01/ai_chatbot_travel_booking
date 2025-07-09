import React from "react";
import logo from "../../assets/AI 챗봇 여행 플랫폼-001-Photoroom.png";

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top">
        <div className="container-fluid">
          {/* 로고 */}
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src={logo}
              alt="OnComma Logo"
              width="120"
              style={{ maxHeight: "100px", objectFit: "contain" ,marginLeft: "200px" }}
              className="me-2"
            />
          </a>

          {/* 모바일 메뉴 토글 */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* 내비게이션 메뉴 */}
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* 가운데 정렬된 좌측 메뉴 */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link text-dark fw-medium px-3" href="/domestic">
                  <i className="bi bi-house-door-fill me-1"></i> 국내여행
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark fw-medium px-3" href="/international">
                  <i className="bi bi-globe-asia-australia me-1"></i> 해외여행
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark fw-medium px-3" href="/accommodations">
                  <i className="bi bi-building me-1"></i> 숙소
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark fw-medium px-3" href="/accommodations">
                  <i className="bi bi-compass me-1"></i> 액티비티
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark fw-medium px-3" href="/flights">
                  <i className="bi bi-airplane-fill me-1"></i> 항공권
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark fw-medium px-3" href="/rentals">
                  <i className="bi bi-car-front-fill me-1"></i> 렌터카
                </a>
              </li>
            </ul>

            {/* 우측 메뉴 */}
            <ul className="navbar-nav d-flex align-items-center">
              <li className="nav-item">
                <a className="nav-link text-muted px-2" href="/bookings">
                  <i className="bi bi-journal-text me-1"></i> 예약내역
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-muted px-2" href="/alerts">
                  <i className="bi bi-heart me-1"></i> 찜
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-muted px-2" href="/mypage">
                  <i className="bi bi-person-circle me-1"></i> 마이페이지
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-muted px-2" href="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i> 로그인/회원가입
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-muted px-2" href="/support">
                  <i className="bi bi-headset me-1"></i> 고객센터
                </a>
              </li>
              <li className="nav-item ms-2">
                <a className="btn btn-primary btn-sm px-3" href="/chatbot">
                  <i className="bi bi-chat-dots me-1"></i> AI 챗봇
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
