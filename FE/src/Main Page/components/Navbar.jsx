import React from "react";
import logo from "../../assets/AI 챗봇 여행 플랫폼-001-Photoroom.png";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
      <div className="container-fluid">
        {/* 로고 */}
        <a className="navbar-brand d-flex align-items-center gap-2" href="/">
          <img
            src={logo}
            alt="OnComma Logo"
            width="150"
            height="auto"
            style={{ maxHeight: "100px", objectFit: "contain" }}
            className="me-2"
          />
        </a>

        {/* 모바일 메뉴 토글 */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 메뉴 항목 */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto gap-2">

            {/* 숙소 */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="accommodationDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-building me-1"></i> 숙소
              </a>
              <ul className="dropdown-menu" aria-labelledby="accommodationDropdown">
                <li><a className="dropdown-item" href="/accommodations/domestic">국내 숙소</a></li>
                <li><a className="dropdown-item" href="/accommodations/overseas">해외 숙소</a></li>
                <li><a className="dropdown-item" href="/rooms">객실 정보</a></li>
              </ul>
            </li>

            {/* 여행상품 */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="travelDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-globe-asia-australia me-1"></i> 여행상품
              </a>
              <ul className="dropdown-menu" aria-labelledby="travelDropdown">
                <li><a className="dropdown-item" href="/travel-products/package">패키지</a></li>
                <li><a className="dropdown-item" href="/travel-products/free">자유여행</a></li>
                <li><a className="dropdown-item" href="/travel-products/honeymoon">허니문</a></li>
                <li><a className="dropdown-item" href="/travel-products/golf">골프</a></li>
                <li><a className="dropdown-item" href="/travel-products/activity">액티비티</a></li>
                <li><a className="dropdown-item" href="/travel-products/flight">항공권</a></li>
                <li><a className="dropdown-item" href="/travel-products/rentcar">렌터카</a></li>
              </ul>
            </li>

            {/* 예약내역 */}
            <li className="nav-item">
              <a className="nav-link" href="/bookings">
                <i className="bi bi-calendar-check me-1"></i> 예약내역
              </a>
            </li>

            {/* 프로모션 */}
            <li className="nav-item">
              <a className="nav-link" href="/promotions">
                <i className="bi bi-tags me-1"></i> 프로모션
              </a>
            </li>

            {/* AI 챗봇 */}
            <li className="nav-item">
              <a className="nav-link" href="/chatbot">
                <i className="bi bi-robot me-1"></i> AI 챗봇
              </a>
            </li>

            {/* 고객지원 */}
            <li className="nav-item">
              <a className="nav-link" href="/support">
                <i className="bi bi-question-circle me-1"></i> 고객지원
              </a>
            </li>

            {/* 마이페이지 */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="mypageDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i> 마이페이지
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="mypageDropdown">
                <li><a className="dropdown-item" href="/profile">내 정보</a></li>
                <li><a className="dropdown-item" href="/my-bookings">예약 내역</a></li>
                <li><a className="dropdown-item" href="/my-reviews">내 리뷰</a></li>
                <li><a className="dropdown-item" href="/my-coupons">내 쿠폰</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="/login">로그인</a></li>
                <li><a className="dropdown-item" href="/logout">로그아웃</a></li>
              </ul>
            </li>

            {/* 관리자 */}
            <li className="nav-item">
              <a className="nav-link text-danger fw-semibold" href="/admin">
                <i className="bi bi-shield-lock-fill me-1"></i> 관리자
              </a>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
