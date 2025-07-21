// src/router/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import LoginStatus from '../components/user/LoginStatus';

export default function Router() {
  return (
    <>
      {/* 공통 헤더 */}
      <Header />

      {/* 여기서부터 라우트 */}
      <main>
        <Routes>

          {/* 로그인 라우트 */}
          <Route path="/login" element={<LoginStatus />} />

          {/* 기타 페이지들… */}
        </Routes>
      </main>

      {/* 공통 푸터 */}
      <Footer />
    </>
  );
}
