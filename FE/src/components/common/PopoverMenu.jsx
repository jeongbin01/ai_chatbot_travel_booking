// src/components/common/PopoverMenu.jsx
import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/layout/Header.css';  // 기존 CSS

// 네비게이션 링크 데이터
const navLinks = [
  { to: '/?activeSearch=domestic', text: '국내숙소' },
  { to: '/?activeSearch=overseas', text: '해외숙소' },
  { to: '/?activeSearch=overseas_package', text: '액티비티' },
];

const PopoverMenu = forwardRef(({ isLoggedIn, user, onLogout }, ref) => {
  return (
    <div className="popover-menu" ref={ref}>
      {/* 로그인 전 */}
      {!isLoggedIn && (
        <>
          <Link to="/login" className="side-login-btn">
            로그인/회원가입
          </Link>
        </>
      )}

      {/* My 요약 카드 */}
      {isLoggedIn && (
        <div className="popover-section">
          <span className="menu-group-title">My</span>
          <div className="my-summary-card">
            <Link to="/mypage/profile" className="my-nickname">
              {user.nickname}
              <i className="bi bi-chevron-right arrow-icon" />
            </Link>

            <div className="membership-info">
              <div className="membership-tier">
                <strong>Basic</strong>
                <Link to="/benefits" className="benefit-link">
                  혜택 보기 ›
                </Link>
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
      )}

      {/* 모든 여행 */}
      <div className="popover-section">
        <span className="menu-group-title">모든 여행</span>
        <ul className="popover-menu-list">
          {navLinks.map(({ to, text, hasBadge }) => (
            <li key={to}>
              <Link to={to}>
                {text} {hasBadge && <span className="badge-new">new</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 로그인 후 내 정보 */}
      {isLoggedIn && (
        <div className="popover-section">
          <span className="menu-group-title">내 정보</span>
          <ul className="popover-menu-list">
            <li><Link to="/mypage/bookings">예약 내역</Link></li>
            <li><Link to="/mypage/wishlist">찜 목록</Link></li>
            <li>
              <Link to="/mypage/coupons">
                쿠폰함{' '}
                {user.unused_coupon_count > 0 && (
                  <span className="coupon-badge">{user.unused_coupon_count}</span>
                )}
              </Link>
            </li>
            <li>
              <button
                onClick={onLogout}
                className="popover-logout-btn"
                type="button"
              >
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* 관리자 메뉴 */}
      {isLoggedIn && user.user_role === '관리자' && (
        <div className="popover-section">
          <span className="menu-group-title">관리자</span>
          <ul className="popover-menu-list">
            <li><Link to="/admin">회원 정보 페이지</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
});

export default PopoverMenu;
