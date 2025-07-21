// src/components/user/LoginStatus.jsx
import React from "react";
import { Link } from "react-router-dom";

const LoginStatus = ({ isLoggedIn, user }) => {
  return (
    <div style={{ textAlign: "right", marginRight: "12px" }}>
      {isLoggedIn ? (
        <span style={{ fontWeight: "bold" }}>
          {user.nickname}님 환영합니다!
        </span>
      ) : (
        <Link
          to="/login"
          style={{ textDecoration: "none", color: "#333", fontWeight: 500 }}
        >
          <span>로그인/회원가입</span>
        </Link>
      )}
    </div>
  );
};

export default LoginStatus;
