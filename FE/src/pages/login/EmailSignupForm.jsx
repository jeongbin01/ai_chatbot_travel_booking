import React, { useState } from "react";
import styles from "../../styles/components/EmailSignupForm.module.css";

export default function EmailSignupForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    nickname: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      username: form.username,
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,
      nickname: form.nickname,
    };

    try {
      console.log(requestBody.email);
      console.log(requestBody.password);
      console.log(requestBody.phoneNumber);
      console.log(requestBody.nickname);

      const response = await fetch("http://localhost:8888/app/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("회원가입 성공");
        setForm({
          username: "",
          email: "",
          password: "",
          phoneNumber: "",
          nickname: "",
        });
      } else {
        const errorData = await response.text();
        alert("회원가입 실패: " + errorData);
      }
    } catch (err) {
      console.error("오류 발생:", err);
      alert("오류 발생");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.signupBox}>
        <h2 className={styles.title}>회원가입을 해주세요</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username">
              아이디 <span className={styles.required}>*</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">
              이메일 <span className={styles.required}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">
              비밀번호 <span className={styles.required}>*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="phoneNumber">전화번호</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="010-1234-5678"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              value={form.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            회원가입
          </button>
        </form>

        <p className={styles.footerText}>
          이미 계정이 있으신가요?{" "}
          <a href="/login/email" className={styles.link}>
            이메일로 로그인
          </a>
        </p>
      </div>
    </div>
  );
}
