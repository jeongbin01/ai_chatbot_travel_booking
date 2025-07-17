import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/images/Main/On_Comma.png";
import "../../styles/layout/Header.css";

const Header = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const menuRef = useRef();
  const buttonRef = useRef();

  // ✅ 예시 유저 데이터 (Context/API 연동 시 아래 부분 대체 가능)
  const [isLoggedIn] = useState(true); // 로그인 상태 (true면 로그인된 상태)
  const [user] = useState({
    nickname: "정빈",
    profile_image_url: "/assets/images/profile/sample-user.png",
    user_role: "관리자",
    unused_coupon_count: 2,
  });

  const togglePopover = () => setIsPopoverOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(e.target)
    ) {
      setIsPopoverOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div id="__next">
      <header className="header-wrapper">
        <div className="header-inner">
          {/* 로고 */}
          <a href="/" className="logo">
            <img src={logo} alt="OnComma 로고" />
          </a>

          {/* ✅ 여기에 중간 메뉴 삽입 */}
          <nav className="gnb-nav">
            <ul className="gnb-menu">
              <li>
                <a href="/?activeSearch=domestic">국내숙소</a>
              </li>
              <li>
                <a href="/?activeSearch=overseas">해외숙소</a>
              </li>
              <li>
                <a href="/?activeSearch=overseas_package">액티비티</a>
              </li>
              <li>
                <a href="/flight">항공</a>
              </li>
              <li>
                <a href="/car-rental">렌터카</a>
              </li>
            </ul>
          </nav>

          {/* 오른쪽 영역 */}
          <div className="header-right">
            {isLoggedIn ? (
              <div className="user-info">
                <img
                  src={user.profile_image_url}
                  alt="프로필"
                  className="profile-image"
                />
                <span>{user.nickname}님</span>
                <a href="/mypage" className="header-button">
                  마이페이지
                </a>
              </div>
            ) : (
              <div className="auth-buttons">
                <a href="/login" className="header-button">
                  로그인
                </a>
                <a href="/signup" className="header-button">
                  회원가입
                </a>
              </div>
            )}

            {/* 햄버거 메뉴 버튼 */}
            <div
              className="header-button"
              onClick={togglePopover}
              role="button"
              aria-label="메뉴 열기"
              ref={buttonRef}
            >
              <i className="bi bi-list"></i>
            </div>

            {/* 팝오버 메뉴 */}
            {isPopoverOpen && (
              <div className="popover-menu" ref={menuRef}>
                {/* 비로그인 시 노출 */}
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

                {/* 공통 메뉴 */}
                <div className="popover-section">
                  <span className="menu-group-title">모든 여행</span>
                  <ul className="popover-menu-list">
                    <li>
                      <a href="/?activeSearch=domestic">국내숙소</a>
                    </li>
                    <li>
                      <a href="/?activeSearch=overseas">해외숙소</a>
                    </li>
                    <li>
                      <a href="/?activeSearch=overseas_package">
                        액티비티 <span className="badge-new">new</span>
                      </a>
                    </li>
                    <li>
                      <a href="/flight">항공</a>
                    </li>
                    <li>
                      <a href="/car-rental">렌터카</a>
                    </li>
                  </ul>
                </div>

                {/* 로그인된 사용자 정보 */}
                {isLoggedIn && (
                  <div className="popover-section">
                    <span className="menu-group-title">내 정보</span>
                    <ul className="popover-menu-list">
                      <li>
                        <a href="/mypage/bookings">예약 내역</a>
                      </li>
                      <li>
                        <a href="/mypage/wishlist">찜 목록</a>
                      </li>
                      <li>
                        <a href="/mypage/coupons">
                          쿠폰함{" "}
                          {user.unused_coupon_count > 0 && (
                            <span className="coupon-badge">
                              {user.unused_coupon_count}
                            </span>
                          )}
                        </a>
                      </li>
                      <li>
                        <a href="/logout">로그아웃</a>
                      </li>
                    </ul>
                  </div>
                )}

                {/* 관리자 메뉴 */}
                {isLoggedIn && user.user_role === "관리자" && (
                  <div className="popover-section">
                    <span className="menu-group-title">관리자</span>
                    <ul className="popover-menu-list">
                      <li>
                        <a href="/admin">관리자 페이지</a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
