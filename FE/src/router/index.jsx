// src/router/index.jsx (또는 App.jsx 내부에 포함 가능)
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import LoginPage from "../pages/auth/LoginPage";
import OAuthCallback from "../pages/auth/OAuthCallback";
// 필요한 경우:
import SignupPage from "../pages/auth/SignupPage";
import LoginForm from "../pages/auth/LoginForm";
import SignupForm from "../pages/auth/SignupForm";

export default function Router() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* 로그인 관련 경로 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/form" element={<LoginForm />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/form" element={<SignupForm />} />

        {/* OAuth 콜백용 경로 */}
        <Route path="/app/login/oauth2/code/google" element={<OAuthCallback />} />
        <Route path="/app/login/oauth2/code/naver" element={<OAuthCallback />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
