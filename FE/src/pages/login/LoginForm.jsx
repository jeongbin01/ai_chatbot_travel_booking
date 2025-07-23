import React, { useState } from "react";
import styles from "../../styles/components/JwtLoginTest.module.css";

export default function JwtLoginTest() {
  const [username, setUsername] = useState(""); // 이메일 대신 username
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("로그인 시도중...");

    try {
      const response = await fetch("http://localhost:8888/app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("로그인 실패");

      const data = await response.json();

      if (data.token) {
        setToken(data.token);
        localStorage.setItem("jwtToken", data.token);
        setMessage("로그인 성공! 토큰 저장됨.");
      } else {
        setMessage("토큰을 받지 못했습니다.");
      }
    } catch (error) {
      setMessage(error.message || "로그인 중 오류 발생");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>로그인해 주세요</h2>
        
        <label htmlFor="email" className={styles.label}>
          아이디
        </label>
        <input
          type="text"
          placeholder="아이디를 입력해주세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
        
        <label htmlFor="password" className={styles.label}>
          비밀번호
        </label>
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.submitButton}>
          로그인
        </button>

        {/*  로그인 링크 */}
        <p className={styles.footerText}>
          계정이 없으신가요?{" "}
          <a href="/signup/email" className={styles.link}>
            이메일로 회원가입
          </a>
        </p>

        {/*  메시지 출력 */}
        {message && <p className={styles.message}>{message}</p>}

        {/* 토큰 출력 */}
        {token && (
          <div className={styles.tokenBox}>
            <strong>받은 JWT 토큰:</strong>
            <pre>{token}</pre>
          </div>
        )}
      </form>
    </div>
  );
}
