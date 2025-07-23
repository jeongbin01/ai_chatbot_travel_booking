import React, { useEffect, useState } from "react";
import styles from "../../styles/components/GoogleLoginButton.module.css";

function GoogleLoginButton() {
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
    <div className={styles["google-login-container"]}>
      {accessToken ? (
        <div>
          <p>
            <strong>JWT 토큰:</strong>
          </p>
          <pre className={styles["token-box"]}>{accessToken}</pre>
          <button onClick={handleLogout} className={styles["logout-btn"]}>
            로그아웃
          </button>
        </div>
      ) : (
        <button onClick={handleGoogleLogin} className={styles.googleLoginBtn}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className={styles.googleIcon}
          />
          구글로 시작하기
        </button>
      )}
    </div>
  );
}

export default GoogleLoginButton;
