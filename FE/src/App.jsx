// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/common/Header";
import HeroBanner from "./components/main/HeroBanner";
import PromotionBanner from "./components/main/PromotionBanner";
import DomesticAccommodations from "./components/product/DomesticAccommodations";
import OverseasAccommodations from "./components/product/OverseasAccommodations";
import Footer from "./components/common/Footer";
import ReviewSlider from "./components/review/ReviewSlider";
import TopTravelProducts from "./components/product/TopTravelProducts";
import ScrollToTopButton from "./components/common/ScrollToTopButton";
import ChatbotShortcut from "./components/common/ChatbotShortcut";

import LoginForm from "./pages/login/LoginForm";
import GoogleForm from "./pages/login/GoogleForm";
import SignupForm from "./pages/login/SignupForm";
import HttpHeadersProvider from "./context/HttpHeader";
import AuthProvider from "./context/AuthProvider";
import MyPage from "./pages/user/MyPage";
import Favorites from "./pages/user/Favorites";
import Reservations from "./pages/user/Reservations"; // ✅ 누락된 import 추가
import AccommodationList from "./pages/accommodations/숙소/AccommodationList.jsx";
import AccommodationDetail from "./pages/accommodations/숙소/AccommodationDetail";
import BookingPage from "./pages/booking/bookingPage"; // ✅ 이 줄을 추가하세요

function App() {
  const location = useLocation();

  // 로그인, 회원가입 등 Footer 제거 페이지
  const hideFooterRoutes = ["/login", "/login/email", "/signup/email"];

  return (
    <>
      <AuthProvider>
        <HttpHeadersProvider>
          <Header />

          <Routes>
            {/* ✅ 메인 페이지 */}
            <Route
              path="/"
              element={
                <>
                  <HeroBanner />
                  <PromotionBanner />
                  <DomesticAccommodations />
                  <OverseasAccommodations />
                  <TopTravelProducts />
                  <ChatbotShortcut />
                  <ScrollToTopButton />
                  <ReviewSlider />
                  <BookingPage />
                </>
              }
            />

            {/* ✅ 로그인 */}
            <Route
              path="/login"
              element={
                <>
                  <LoginForm />
                  <GoogleForm />
                </>
              }
            />

            {/* ✅ 회원가입 */}
            <Route path="/signup/email" element={<SignupForm />} />

            {/* ✅ 숙소 목록 (isDomestic prop 명시) */}
            <Route
              path="/domesticpages"
              element={<AccommodationList isDomestic={true} />}
            />
            <Route
              path="/overseaspages"
              element={<AccommodationList isDomestic={false} />}
            />

            {/* 국내 숙소 상세 */}
            <Route
              path="/domesticpages/:id"
              element={<AccommodationDetail />}
            />

            {/* 해외 숙소 상세 */}
            <Route
              path="/overseaspages/:id"
              element={<AccommodationDetail />}
            />
            {/* ✅ 예약 페이지 */}
            {/* <Route path="/booking/:id" element={<BookingPage />} /> */}

            {/* ✅ 마이페이지 */}
            <Route path="/mypage/profile" element={<MyPage />} />
            <Route path="/mypage/wishlist" element={<Favorites />} />
            <Route path="/mypage/bookings" element={<Reservations />} />

            {/* 챗봇 */}
             <Route path="/chatbot" element={<ChatbotShortcut />} />
          </Routes>

          {/* ✅ Footer는 특정 경로에서만 제거 */}
          {!hideFooterRoutes.includes(location.pathname) && <Footer />}
        </HttpHeadersProvider>
      </AuthProvider>
    </>
  );
}

export default App;
