import React from "react";

const LoginStatus = ({ isLoggedIn, user }) => {
  return (
    <div style={{ textAlign: "right", marginRight: "12px" }}>
      {isLoggedIn ? (
        <span style={{ fontWeight: "bold" }}>
          {user.nickname}님 환영합니다!
        </span>
      ) : (<a
          href="/login"
          style={{ textDecoration: "none", color: "#333", fontWeight: 500 }}
        >
          로그인 / 회원가입
        </a>
      )}
    </div>
  );
};

export default LoginStatus;
