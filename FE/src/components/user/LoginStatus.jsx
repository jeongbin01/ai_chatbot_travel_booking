import React from "react";

const LoginStatus = ({ isLoggedIn, user }) => {
  return (
    <div style={{ textAlign: "right", margin: "8px 16px" }}>
      {isLoggedIn ? (
        <span>{user.nickname}님 환영합니다!</span>
      ) : (
        <a href="/login">로그인 / 회원가입</a>
      )}
    </div>
  );
};

export default LoginStatus;
