import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/components/JwtLoginTest.module.css"; // 경로는 프로젝트 구조에 맞게 수정

export default function JwtLoginTest() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("로그인 시도중...");

    try {
      const response = await fetch("http://localhost:8888/app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        <h2 className={styles.title}>로그인을 해주세요</h2>

        {/* 이메일 필드 */}
        <div className={styles.field}>
          <label htmlFor="email">
            이메일<span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="abc@gccompany.co.kr"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* 비밀번호 필드 */}
        <div className={styles.field}>
          <label htmlFor="password">
            비밀번호<span className={styles.required}>*</span>
          </label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* 로그인 버튼 */}
        <button type="submit" className={styles.loginBtn}>
          로그인
        </button>

        {/* 회원가입 링크 */}
        <div className={styles.footer}>
          계정이 없으신가요?
          <Link to="/signup/email">이메일로 회원가입</Link>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <p
            className={styles.message}
            style={{ color: message.includes("성공") ? "green" : "red" }}
          >
            {message}
          </p>
        )}

        {/* JWT 토큰 디버깅 박스 */}
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
