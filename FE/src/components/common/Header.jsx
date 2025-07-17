import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/images/Main/On_Comma.png";
import "../../styles/layout/Header.css";

const Header = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const menuRef = useRef();
  const buttonRef = useRef();

  const togglePopover = () => {
    setIsPopoverOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    // 메뉴 영역이나 버튼 외 클릭 시 닫기
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
          <a href="/" className="logo">
            <img src={logo} alt="OnComma 로고" />
          </a>

          <div className="header-right">
            <a href="/login" className="header-button">
              로그인/회원가입
            </a>

            <div
              className="header-button"
              onClick={togglePopover}
              role="button"
              aria-label="메뉴 열기"
              ref={buttonRef}
            >
              <i className="bi bi-list"></i>
            </div>

            {/* 메뉴에 ref 추가 */}
            {isPopoverOpen && (
              <div className="popover-menu" ref={menuRef}>
                <a href="/benefit/elite"></a>
                <a href="/login" className="side-login-btn">
                  로그인/회원가입
                </a>

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
                    <li>
                      <a href="/space-rental">공간대여</a>
                    </li>
                  </ul>
                </div>

                <div className="popover-section">
                  <ul className="popover-menu-list">
                    <li>
                      <a href="https://platform.yeogi.com/guest/reservation/check">
                        비회원 예약조회
                      </a>
                    </li>
                    <li>
                      <a href="/event">이벤트</a>
                    </li>
                    <li>
                      <a href="/faq">고객센터</a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
