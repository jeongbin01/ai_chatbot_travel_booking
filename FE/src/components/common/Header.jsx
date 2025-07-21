// src/components/common/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/layout/Header.module.css';
import LoginStatus from '../user/LoginStatus';
import PopoverMenu from './PopoverMenu';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import logo from '../../assets/images/Main/On_Comma.png';
import { fetchCurrentUser, logout } from '../../api/auth';

const Header = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser()
      .then(res => {
        setIsLoggedIn(true);
        setUser(res.data);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      });
  }, []);

  const handleLogout = () => {
    logout()
      .then(() => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('accessToken');
        navigate('/');
      })
      .catch(err => console.error(err));
  };

  useOnClickOutside([btnRef, popRef], () => setIsPopoverOpen(false));

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="OnComma 로고" />
        </Link>

        <div className={styles.headerRight}>
          <LoginStatus isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

          <button
            ref={btnRef}
            className={styles.headerButton}
            onClick={() => setIsPopoverOpen(o => !o)}
            aria-label="메뉴 열기"
            aria-expanded={isPopoverOpen}
          >
            <i className="bi bi-list" />
          </button>

          {isPopoverOpen && (
            <div ref={popRef} className={styles.popoverContainer}>
              <PopoverMenu isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
