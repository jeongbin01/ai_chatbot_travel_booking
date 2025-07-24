// src/components/user/LoginStatus.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const LoginStatus = ({ onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const username = Cookies.get("username");

      if (username) {
        setIsLoggedIn(true);
        setNickname(username);
      } else {
        setIsLoggedIn(false);
      }
    }, 1000); // 1초마다 확인

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwtToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("username", { path: "/" });
    Cookies.remove("email", { path: "/" });

    setIsLoggedIn(false);
    if (onLogout) onLogout();
  };

  return (
    <div style={{ textAlign: 'right', marginRight: '12px' }}>
      {isLoggedIn ? (
        <>
          <span style={{ fontWeight: 'bold' }}>{nickname}님 환영합니다!</span>
          <button onClick={handleLogout} style={{ marginLeft: '8px' }}>
            로그아웃
          </button>
        </>
      ) : (
        <Link to="/login" style={{ textDecoration: 'none', color: '#333', fontWeight: 500 }}>
          로그인/회원가입
        </Link>
      )}
    </div>
  );
};

export default LoginStatus;
