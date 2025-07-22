import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/components/EmailSignupForm.module.css";


export default function EmailSignupForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 여기에 회원가입 API 요청 로직 작성
    console.log("회원가입 정보:", form);
    setMessage("회원가입 성공! 🎉");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className={styles.container}>

      <h2 className={styles.title}>이메일 회원가입</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email">
            이메일 <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">
            비밀번호 <span className={styles.required}>*</span>
          </label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호 입력"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword">
            비밀번호 확인 <span className={styles.required}>*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 재입력"
          />
        </div>

        <button type="submit" className={styles.signupBtn}>
          회원가입
        </button>

        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
}
