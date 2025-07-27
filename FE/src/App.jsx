// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/common/Header";
import HeroBanner from "./components/main/HeroBanner";
import PromotionBanner from "./components/main/PromotionBanner";
import DomesticAccommodations from "./components/product/DomesticAccommodations";
import OverseasAccommodations from "./components/product/OverseasAccommodations";
// import TimeSaleSection from "./components/main/TimeSaleSection";
import Footer from "./components/common/Footer";
// import AugustTripList from "./components/main/AugustTripList";
import ReviewSlider from "./components/review/ReviewSlider";
import TopTravelProducts from "./components/product/TopTravelProducts";
import ScrollToTopButton from "./components/common/ScrollToTopButton";
import ChatbotShortcut from "./components/common/ChatbotShortcut";

import LoginForm from "./pages/login/LoginForm";
import GoogleForm from "./pages/login/GoogleForm";
import SignupForm from "./pages/login/SignupForm";
import HttpHeadersProvider from "./context/HttpHeader";
import AuthProvider from "./context/AuthProvider";
import AccommodationList from "./pages/accommodations/국내 숙소/AccommodationList";
import AccommodationDetail from "./pages/accommodations/국내 숙소/AccommodationDetail";
import MyPage from "./pages/user/MyPage";
import Favorites from "./pages/user/Favorites";
import Reservations from "./pages/user/reservations";

function App() {
  const location = useLocation();

  // Footer를 숨기고 싶은 경로들 정의
  const hideFooterRoutes = ["/login", "/login/email", "/signup/email"];

  return (
    <>
      <AuthProvider>
        <HttpHeadersProvider>
          <Header />

          <Routes>
            {/* 메인 페이지 */}
            <Route
              path="/"
              element={
                <>
                  <HeroBanner />
                  <PromotionBanner />
                  <DomesticAccommodations />
                  <OverseasAccommodations />
                  <TopTravelProducts />
                  {/* <TimeSaleSection />
                      <AugustTripList /> */}
                  <ChatbotShortcut />
                  <ScrollToTopButton />
                  <ReviewSlider />
                </>
              }
            />

            {/* 로그인 */}
            <Route
              path="/login"
              element={
                <>
                  <LoginForm />
                  <GoogleForm />
                </>
              }
            />

            {/* 회원가입 */}
            <Route path="/signup/email" element={<SignupForm />} />

            {/* 국내숙소 */}
            <Route path="/domesticpages" element={<AccommodationList />} />
            <Route path="/domesticpages/:id" element={<AccommodationDetail />} />

            {/* 마이페이지 */}
            <Route path="/mypage/profile" element={<MyPage />} />
            <Route path="/mypage/wishlist" element={<Favorites />} />
            {/* 여기만 React → Route 로 수정 */}
            <Route path="/mypage/bookings" element={<Reservations />} />
          </Routes>

          {/* 조건부 Footer 렌더링 */}
          {!hideFooterRoutes.includes(location.pathname) && <Footer />}
        </HttpHeadersProvider>
      </AuthProvider>
    </>
  );
}

export default App;
