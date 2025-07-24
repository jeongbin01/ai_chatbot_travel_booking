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
import EmailSignupForm from "./pages/login/EmailSignupForm";
import DomesticHome from "./pages/accommodations/국내 숙소/DomesticHome";
import AccommodationCard from "./pages/accommodations/국내 숙소/AccommodationCardPage";

function App() {
  const location = useLocation();

  // Footer를 숨기고 싶은 경로들 정의
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
        <Route path="/signup/email" element={<EmailSignupForm />} />

        {/* 국내숙소 */}
        <Route
          path="/domesticpages"
          element={
            <>
              <DomesticHome />
            </>
          }
        />
        <Route
          path="/accommodation/:id"
          element={
            <>
              <AccommodationCard/>
            </>
          }
        />

        {/* 해외숙소 */}
        {/* <Route path="/overseas" element={<OverseasHome />} /> */}

        {/* 액티비티 */}
        {/* <Route path="/overseas_package" element={<OverseasPackage />} /> */}
      </Routes>

      {/* 조건부 Footer 렌더링 */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
