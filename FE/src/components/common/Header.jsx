// src/components/common/Header.jsx
import React, { useState, useRef } from "react";
import styles from "../../styles/layout/Header.module.css";
import LoginStatus from "../user/LoginStatus";
import PopoverMenu from "./PopoverMenu";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import logo from "../../assets/images/Main/On_Comma.png";

const Header = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const btnRef = useRef(null);
  const popRef = useRef(null);

  // 예시 유저 데이터 (실제로는 Context/API 연동)
  const isLoggedIn = true;
  const user = {
    nickname: "정빈",
    profile_image_url: logo,
    user_role: "관리자",
    unused_coupon_count: 2,
  };

  // 외부 클릭 시 닫기
  useOnClickOutside([btnRef, popRef], () => setIsPopoverOpen(false));

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerInner}>
        {/* 로고 */}
        <a href="/" className={styles.logo}>
          <img src={logo} alt="OnComma 로고" />
        </a>

        {/* GNB 메뉴바 */}
        <nav className={styles.gnbNav} aria-label="주요 메뉴">
          <ul className={styles.gnbMenu}>
          </ul>
        </nav>

        {/* 우측 로그인 + 햄버거 */}
        <div className={styles.headerRight}>
          <LoginStatus isLoggedIn={isLoggedIn} user={user} />

          <button
            ref={btnRef}
            className={styles.headerButton}
            onClick={() => setIsPopoverOpen((o) => !o)}
            aria-label="메뉴 열기"
            aria-expanded={isPopoverOpen}
          >
            <i className="bi bi-list" />
          </button>

          {isPopoverOpen && (
            <div ref={popRef} className={styles.popoverContainer}>
              <PopoverMenu isLoggedIn={isLoggedIn} user={user} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
