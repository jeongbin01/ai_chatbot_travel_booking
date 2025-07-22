import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/components/GoogleLoginButton.module.css";
import logo from "../../assets/images/Main/On_Comma.png";

export default function GoogleLoginButton() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    if (token) {
      localStorage.setItem("accessToken", token);
      setAccessToken(token);
      window.history.replaceState({}, document.title, "/");
    } else {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) setAccessToken(storedToken);
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8888/oauth2/authorization/google";
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  };

  return (
    <div className={styles.container}>
      {/* 로고 */}
      <img src={logo} alt="OnComma 로고" className={styles.logo} />

      {/* 가로선 타이틀 */}
      <div className={styles.titleWrapper}>
        <span className={styles.line}></span>
        <span className={styles.titleText}>로그인 / 회원가입</span>
        <span className={styles.line}></span>
      </div>

      {/* 로그인 상태 확인 */}
      {accessToken ? (
        <>
          <p className={styles.label}>JWT 토큰:</p>
          <pre className={styles.tokenBox}>{accessToken}</pre>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            로그아웃
          </button>
        </>
      ) : (
        <>
          <button onClick={handleGoogleLogin} className={styles.googleBtn}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              width="20"
              height="20"
              style={{ marginRight: "10px" }}
            />
            구글로 시작하기
          </button>

          <Link to="/login/email" className={styles.emailBtn}>
            <i
              className="bi bi-envelope-fill"
              style={{ marginRight: "8px" }}
            ></i>
            이메일로 시작하기
          </Link>
        </>
      )}
    </div>
  );
}
