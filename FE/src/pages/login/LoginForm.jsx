import React, { useState } from "react";
import styles from "../../styles/components/JwtLoginTest.module.css";
import { useNavigate } from "react-router-dom";

export default function JwtLoginTest() {
  const [username, setUsername] = useState(""); // 사용자 ID
  const [password, setPassword] = useState(""); // 비밀번호
  const [message, setMessage] = useState("");   // 메시지 출력
  const [token, setToken] = useState(null);     // JWT 토큰 저장

  const navigate = useNavigate();

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
        alert("로그인 성공! 토큰 저장됨.");
        setToken(data.token);
        localStorage.setItem("jwtToken", data.token);
        navigate("/");
      } else {
        alert("토큰을 받지 못했습니다.");
      }
    } catch {
      alert("로그인 중 오류 발생");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>로그인해 주세요</h2>

        <div className={styles.field}>
          <label htmlFor="username" className={styles.label}>아이디</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디를 입력하세요"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          로그인
        </button>

        {/* 메시지 출력 영역 */}
        {message && <p className={styles.message}>{message}</p>}

        {/* 토큰 출력 (개발 확인용) */}
        {token && (
          <div className={styles.tokenBox}>
            <strong>받은 JWT 토큰:</strong>
            <pre>{token}</pre>
          </div>
        )}

        <p className={styles.footerText}>
          계정이 없으신가요?{" "}
          <a href="/signup/email" className={styles.link}>
            이메일로 회원가입
          </a>
        </p>
      </form>
    </div>
  );
}
