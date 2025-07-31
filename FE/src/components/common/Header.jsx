// src/components/common/Header.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/layout/Header.module.css";
import LoginStatus from "../user/LoginStatus";
import PopoverMenu from "./PopoverMenu";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import logo from "../../assets/images/Main/On_Comma.png";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  // 로그인 상태 로딩
  useEffect(() => {
    if (auth) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [auth]);

  // 로그아웃 처리
  const handleLogout = () => {
    Object.keys(Cookies.get()).forEach(cookieName => {
      Cookies.remove(cookieName, { path: "/" });
    });
    setIsLoggedIn(false);
    setAuth(null);
    setUser(null);
    setIsPopoverOpen(false);
    navigate("/"); // 로그아웃 시 메인 페이지로 이동
  };

  // 외부 클릭 시 Popover 닫기
  useOnClickOutside([btnRef, popRef], () => setIsPopoverOpen(false));

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerInner}>
        {/* 로고 클릭 시 홈 이동 */}
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="OnComma 로고" />
        </Link>

        <div className={styles.headerRight}>
          {/* 로그인 상태 */}
          <LoginStatus/>

          {/* 햄버거 버튼 */}
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
                user={user || {}}
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
