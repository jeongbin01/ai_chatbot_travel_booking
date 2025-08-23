import React, { useState } from "react";
import styles from "../../styles/components/EmailSignupForm.module.css";
import { useNavigate } from "react-router-dom";

export default function EmailSignupForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    nickname: "",
  });

  // 숫자만 추출
  const onlyDigits = (s) => s.replace(/\D/g, "");

  // 010-1234-5678 형태로 포맷 (모바일 기준 3-4-4)
  const formatPhone = (v) => {
    const d = onlyDigits(v).slice(0, 11); // 최대 11자리(010포맷)
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  };

  // 공통 변경 핸들러 (전화번호는 별도 처리)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      setForm((prev) => ({ ...prev, phoneNumber: formatPhone(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 서버엔 숫자만 전달 (백엔드가 하이픈 허용하면 form.phoneNumber 써도 됨)
    const normalizedPhone = onlyDigits(form.phoneNumber);

    const requestBody = {
      username: form.username,
      email: form.email,
      password: form.password,
      phoneNumber: normalizedPhone,
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
        navigate("/");
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
            <label htmlFor="username" className={styles.label}>
              아이디
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
            <label htmlFor="email" className={styles.label}>
              이메일
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
            <label htmlFor="password" className={styles.label}>
              비밀번호
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
            <label htmlFor="phoneNumber" className={styles.label}>
              전화번호
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="010-1234-5678"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={13} // 000-0000-0000
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="nickname" className={styles.label}>
              닉네임
            </label>
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
          <a href="/login" className={styles.link}>
            이메일로 로그인
          </a>
        </p>
      </div>
    </div>
  );
}
