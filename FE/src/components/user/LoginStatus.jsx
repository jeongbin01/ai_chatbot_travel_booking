// src/components/user/LoginStatus.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LoginStatus = ({ isLoggedIn, user, onLogout }) => (
  <div style={{ textAlign: 'right', marginRight: '12px' }}>
    {isLoggedIn ? (
      <>
        <span style={{ fontWeight: 'bold' }}>{user.nickname}님 환영합니다!</span>
        <button onClick={onLogout} style={{ marginLeft: '8px' }}>로그아웃</button>
      </>
    ) : (
      <Link to="/login" style={{ textDecoration: 'none', color: '#333', fontWeight: 500 }}>
        로그인/회원가입
      </Link>
    )}
  </div>
);

export default LoginStatus;
