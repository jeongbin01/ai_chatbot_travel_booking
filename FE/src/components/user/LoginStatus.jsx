import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";

const LoginStatus = ({ onLogout }) => {
  const { auth, setAuth } = useContext(AuthContext); 

  const handleLogout = () => {
    Cookies.remove("jwtToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("username", { path: "/" });
    Cookies.remove("email", { path: "/" });

    setAuth(null); // 로그인 상태 초기화
    if (onLogout) onLogout();
  };

  return (
    <div style={{ textAlign: 'right', marginRight: '12px' }}>
      {auth ? (
        <>
          <span style={{ fontWeight: 'bold' }}>{auth.username}님 환영합니다!</span>
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
