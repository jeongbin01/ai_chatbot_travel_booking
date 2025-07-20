import React, { forwardRef } from "react";
import "../../styles/layout/Header.css";

// 네비게이션 링크 데이터 (Header와 공유)
const navLinks = [
  { href: "/?activeSearch=domestic", text: "국내숙소" },
  { href: "/?activeSearch=overseas", text: "해외숙소" },
  { href: "/?activeSearch=overseas_package", text: "액티비티", hasBadge: true },
  { href: "/flight", text: "항공" },
  { href: "/car-rental", text: "렌터카" },
];

const PopoverMenu = forwardRef(({ isLoggedIn, user }, ref) => {
  return (
    <div className="popover-menu" ref={ref}>
      {!isLoggedIn && (
        <>
          <a href="/login" className="side-login-btn">
            로그인/회원가입
          </a>
          <div className="popover-section">
            <span className="menu-group-title">계정</span>
            <ul className="popover-menu-list">
              <li>
                <a href="/login">로그인</a>
              </li>
              <li>
                <a href="/signup">회원가입</a>
              </li>
            </ul>
          </div>
        </>
      )}

      <div className="popover-section">
        <span className="menu-group-title">My</span>
        <div className="my-summary-card">
          <a href="/mypage/profile" className="my-nickname">
            {user.nickname}
            <i className="bi bi-chevron-right arrow-icon" />
          </a>
          <div className="membership-info">
            <div className="membership-tier">
              <strong>Basic</strong>
              <a href="/benefits" className="benefit-link">
                혜택 보기 ›
              </a>
            </div>
            <p className="upgrade-hint">3번 더 이용하면 다음 등급 혜택 시작!</p>
          </div>
          <div className="point-coupon-box">
            <div className="point-item">
              <span className="label">포인트</span>
              <span className="value">{user.point ?? 0}</span>
            </div>
            <div className="divider" />
            <div className="point-item">
              <span className="label">쿠폰</span>
              <span className="value">{user.unused_coupon_count}장</span>
            </div>
          </div>
        </div>
      </div>

      <div className="popover-section">
        <span className="menu-group-title">모든 여행</span>
        <ul className="popover-menu-list">
          {navLinks.map(({ href, text, hasBadge }) => (
            <li key={href}>
              <a href={href}>
                {text} {hasBadge && <span className="badge-new">new</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {isLoggedIn && (
        <div className="popover-section">
          <span className="menu-group-title">내 정보</span>
          <ul className="popover-menu-list">
            <li><a href="/mypage/bookings">예약 내역</a></li>
            <li><a href="/mypage/wishlist">찜 목록</a></li>
            <li>
              <a href="/mypage/coupons">
                쿠폰함{" "}
                {user.unused_coupon_count > 0 && (
                  <span className="coupon-badge">{user.unused_coupon_count}</span>
                )}
              </a>
            </li>
            <li><a href="/logout">로그아웃</a></li>
          </ul>
        </div>
      )}

      {isLoggedIn && user.user_role === "관리자" && (
        <div className="popover-section">
          <span className="menu-group-title">관리자</span>
          <ul className="popover-menu-list">
            <li><a href="/admin">회원 정보 페이지</a></li>
          </ul>
        </div>
      )}
    </div>
  );
});

export default PopoverMenu;

