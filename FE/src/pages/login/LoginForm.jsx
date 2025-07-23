import React, { useState } from "react";
import styles from "../../styles/components/JwtLoginTest.module.css";
import { useNavigate } from "react-router-dom";
export default function JwtLoginTest() {
  const [username, setUsername] = useState(""); // 이메일 대신 username
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [, setToken] = useState("");
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
        <h2 className={styles.title}>JWT 로그인 테스트</h2>

        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.submitButton}>
          로그인
        </button>

        {/* 메시지 출력 영역 */}
        {message && <p className={styles.message}>{message}</p>}

        <p className={styles.footerText}>
          이미 계정이 있으신가요?{" "}
          <a href="/signup/email" className={styles.link}>
            회원가입로 이동
          </a>
        </p>
</form>
    </div>
  );
}
