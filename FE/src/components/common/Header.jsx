// src/components/common/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/layout/Header.module.css";
import LoginStatus from "../user/LoginStatus";
import PopoverMenu from "./PopoverMenu";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import logo from "../../assets/images/Main/On_Comma.png";

const Header = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsPopoverOpen(false);
  };

  useOnClickOutside([btnRef, popRef], () => setIsPopoverOpen(false));

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerInner}>

        <div className={styles.logo}>
          <img src={logo} alt="OnComma 로고" />
        </div>

        <div className={styles.headerRight}>
          {/* 로그인 */}
          <LoginStatus
            isLoggedIn={isLoggedIn}
            user={user}
            onLogout={handleLogout}
          />

          {/* 햄버거 */}
          <button
            ref={btnRef}
            className={styles.headerButton}
            onClick={() => setIsPopoverOpen((prev) => !prev)}
            aria-label="메뉴 열기"
            aria-expanded={isPopoverOpen}
          >
            <i className="bi bi-list" />
          </button>

          {/* Popover 메뉴 */}
          {isPopoverOpen && (
            <div ref={popRef} className={styles.popoverContainer}>
              <PopoverMenu
                isLoggedIn={isLoggedIn}
                user={user}
                onLogout={handleLogout}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
