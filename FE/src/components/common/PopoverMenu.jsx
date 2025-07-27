// src/components/common/PopoverMenu.jsx
import React, { forwardRef, useContext } from "react";
import { Link } from "react-router-dom";
import "../../styles/layout/Header.css"; // 기존 CSS
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";

// 네비게이션 링크 데이터
const navLinks = [
  { to: "/domesticpages", text: "국내숙소" },
  { to: "/overseaspages", text: "해외숙소" },
  { to: "/overseas_packagepages", text: "액티비티" },
];

const PopoverMenu = forwardRef(({ onLogout }, ref) => {
  const { auth } = useContext(AuthContext);
  return (
    <div className="popover-menu" ref={ref}>
      {/* 로그인 전 */}
      {!auth && (
        <>
          <Link to="/login" className="side-login-btn">
            로그인/회원가입
          </Link>
        </>
      )}

      {/* My 요약 카드 */}
      {auth && (
        <div className="popover-section">
          <span className="menu-group-title">My</span>
          <div className="my-summary-card">
            <Link to="/mypage/profile" className="my-nickname">
              <span style={{ fontWeight: "bold" }}>{auth.username}</span>
              <i className="bi bi-chevron-right arrow-icon" />
            </Link>

            <div className="membership-info">
              <div className="membership-tier">
                <strong>Basic</strong>
                <span className="benefit-link">혜택 보기 ›</span>{" "}
              </div>
              <p className="upgrade-hint">
                3번 더 이용하면 다음 등급 혜택 시작!
              </p>
            </div>
          </div>
        </div>
      )}
      {/* 로그인 후 내 정보 */}
      {auth && (
        <div className="popover-section">
          <span className="menu-group-title">내 정보</span>
          <ul className="popover-menu-list">
            <li>
              <Link to="/mypage/bookings">예약 내역</Link>
            </li>
            <li>
              <Link to="/mypage/wishlist">찜 목록</Link>
            </li>
          </ul>
        </div>
      )}

      {/* 모든 여행 */}
      <div className="popover-section">
        <span className="menu-group-title">모든 여행</span>
        <ul className="popover-menu-list">
          {navLinks.map(({ to, text }) => (
            <li key={to}>
              <Link to={to}>{text}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 로그인 된 경우에만 로그아웃 버튼 */}
      {auth && (
        <li onClick={onLogout} className="popover-logout-btn" type="button">
          로그아웃
        </li>
      )}
    </div>
  );
});

export default PopoverMenu;
