// src/pages/Login.jsx
import React from "react";
import styles from "../../styles/components/Login.module.css";
import logo from "../assets/images/Main/On_Comma.png";

export default function Login() {
  return (
    <div className={styles.container}>
      {/* 로고 */}
      <img src={logo} alt="OnComma 로고" className={styles.logo} />

      {/* 제목 */}
      <h2 className={styles.title}>로그인</h2>

      {/* 로그인 폼 */}
      <input className={styles.input} type="text" placeholder="아이디" />
      <input className={styles.input} type="password" placeholder="비밀번호" />
      <button className={styles.button}>로그인</button>

      {/* Google 로그인 */}
      <button className={`${styles.button} ${styles.googleButton}`}>
        Google 계정으로 로그인
      </button>

      {/* 하단 안내 */}
      <div className={styles.footer}>
        아직 회원이 아니신가요? <a href="/signup">회원가입</a>
      </div>
    </div>
  );
}
