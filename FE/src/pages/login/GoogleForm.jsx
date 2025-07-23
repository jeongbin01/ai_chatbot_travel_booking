import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/components/GoogleLoginButton.module.css";
import logo from "../../assets/images/Main/On_Comma.png";

export default function GoogleLoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8888/oauth2/authorization/google";
  };

  return (
    <div className={styles.container}>
      <img src={logo} alt="OnComma 로고" className={styles.logo} />

      <div className={styles.titleWrapper}>
        <span className={styles.line}></span>
        <span className={styles.titleText}>로그인 / 회원가입</span>
        <span className={styles.line}></span>
      </div>

      <div>
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
          로그인 하기
        </Link>
      </div>
    </div>
  );
}
