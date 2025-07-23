import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/common/Header";
import HeroBanner from "./components/main/HeroBanner";
import PromotionBanner from "./components/main/PromotionBanner";
import DomesticAccommodations from "./components/product/DomesticAccommodations";
import OverseasAccommodations from "./components/product/OverseasAccommodations";
import TimeSaleSection from "./components/main/TimeSaleSection";
import Footer from "./components/common/Footer";
import AugustTripList from "./components/main/AugustTripList";
import ReviewSlider from "./components/review/ReviewSlider";
import TopTravelProducts from "./components/product/TopTravelProducts";
import ScrollToTopButton from "./components/common/ScrollToTopButton";
import ChatbotShortcut from "./components/common/ChatbotShortcut";
import LoginForm from "./pages/login/LoginForm";
import GoogleForm from "./pages/login/GoogleForm";
import EmailSignupForm from "./pages/login/EmailSignupForm";

function App() {
  const location = useLocation();

  // 이 경로들에서는 Footer를 숨깁니다.
  const hideFooterRoutes = ["/login", "/login/email", "/signup/email"];

  return (
    <>
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
              <TimeSaleSection />
              <AugustTripList />
              <ChatbotShortcut />
              <ScrollToTopButton />
              <ReviewSlider />
            </>
          }
        />

        {/* 로그인 페이지 */}
        <Route
          path="/login"
          element={
            <>
              <LoginForm />
              <GoogleForm />
            </>
          }
        />

        {/* 이메일 로그인 페이지 */}
        <Route
          path="/login/email"
          element={
            <>
              <LoginForm />
              <GoogleForm />
            </>
          }
        />

        {/* 이메일 회원가입 페이지 */}
        <Route path="/signup/email" element={<EmailSignupForm />} />
      </Routes>

      {/* Footer 숨기기 */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
