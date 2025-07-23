import React, { useEffect, useState } from "react";
import styles from "../../styles/components/GoogleLoginButton.module.css";

function GoogleLoginButton() {
  const [accessToken, setAccessToken] = useState(null);

  // 컴포넌트 마운트 시, URL에서 access_token 가져와서 저장
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    if (token) {
      localStorage.setItem("accessToken", token);
      setAccessToken(token);

      // URL에서 토큰 제거 (주소창 깔끔하게)
      window.history.replaceState({}, document.title, "/");
    } else {
      // 로컬스토리지에 토큰 있으면 상태에 세팅
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) setAccessToken(storedToken);
    }
  }, []);

  // 구글 OAuth 로그인 시작
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8888/oauth2/authorization/google";
  };

  // 로그아웃 시 토큰 삭제 및 상태 초기화
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  };

  return (
    <div className={styles.container}>
      {accessToken ? (
        <div className={styles.tokenBox}>
          <p>
            <strong>JWT 토큰:</strong>
          </p>
          <pre className={styles.tokenDisplay}>{accessToken}</pre>
          <button className={styles.logoutButton} onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      ) : (
        <button
          onClick={handleGoogleLogin}
          className={styles["google-login-btn"]}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className={styles["google-icon"]}
            width="20"
            height="20"
          />
          구글로 시작하기
        </button>
      )}
    </div>
  );
}

export default GoogleLoginButton;
