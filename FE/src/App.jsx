// src/App.jsx
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

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
import Reservations from "./pages/user/Reservations"; // 예약 내역(리스트)

import AccommodationList from "./pages/accommodations/숙소/AccommodationList.jsx";
import AccommodationDetail from "./pages/accommodations/숙소/AccommodationDetail";

import Chatbotpages from "./pages/chatbot/Chatbotpages.jsx";

import BookingConfirmation from "./pages/booking/BookingConfirmation.jsx";
import BookingPage from "./pages/booking/bookingPage.jsx";

import SearchPage from "./pages/search/SearchPage.jsx";

import JejuAccommodations from "./pages/accommodations/국내/JejuAccommodations.jsx";
import SeoulAccommodations from "./pages/accommodations/국내/SeoulAccommodations.jsx";
import BusanAccommodations from "./pages/accommodations/국내/BusanAccommodations.jsx";
import GangneungAccommodations from "./pages/accommodations/국내/gangneungAccommodations.jsx";
import IncheonAccommodations from "./pages/accommodations/국내/IncheonAccommodations.jsx";

import FukuokaAccommodations from "./pages/accommodations/해외/FukuokaAccommodations.jsx";
import BangkokAccommodations from "./pages/accommodations/해외/BangkokAccommodations.jsx";
import RomeAccommodations from "./pages/accommodations/해외/RomeAccommodations.jsx";
import ParisAccommodations from "./pages/accommodations/해외/ParisAccommodations.jsx";
import SingaporeAccommodations from "./pages/accommodations/해외/SingaporeAccommodations.jsx";

// ✅ 액티비티 (예약/결제/취소 포함)
import ActivitiesMain from "./pages/activities/ActivitiesMain";
import DomesticActivities from "./pages/activities/DomesticActivities";
import InternationalActivities from "./pages/activities/InternationalActivities";
import ActivityDetail from "./pages/activities/ActivityDetail";

// ✅ 스타일
import "./styles/pages/Activities.css";              // 액티비티 리스트
import "./styles/pages/ActivityDetail.css";          // 액티비티 상세
import "./styles/pages/ActivityPaymentModal.css";    // 결제 모달
import "./styles/components/ActivityCard.css";       // 카드
import "./styles/pages/MyReservations.css";          // 마이페이지 예약(흰 배경)
import "./styles/main/hero-center.css";              // 메인 슬라이드 중앙정렬
import "./styles/override/light-force.css";

function App() {
  const location = useLocation();

  // 로그인/회원가입 등 Footer 제거 페이지
  const hideFooterRoutes = ["/login", "/login/email", "/signup/email"];

  return (
    <>
      <AuthProvider>
        <HttpHeadersProvider>
          <Header />

          <Routes>
            {/* 메인 */}
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
                </>
              }
            />

            {/* 로그인/회원가입 */}
            <Route
              path="/login"
              element={
                <>
                  <LoginForm />
                  <GoogleForm />
                </>
              }
            />
            <Route path="/signup/email" element={<SignupForm />} />

            {/* 숙소 목록 */}
            <Route
              path="/domesticpages"
              element={<AccommodationList isDomestic={true} />}
            />
            <Route
              path="/overseaspages"
              element={<AccommodationList isDomestic={false} />}
            />

            {/* 숙소 상세 */}
            <Route path="/domesticpages/:id" element={<AccommodationDetail />} />
            <Route path="/overseaspages/:id" element={<AccommodationDetail />} />

            {/* 예약 페이지/예약 완료 */}
            <Route path="/booking/:id" element={<BookingPage />} />
            {/* 쿼리 ?bid= 로도 쓰므로 파라미터 없는 라우트 추가 */}
            <Route path="/booking/confirmation" element={<BookingConfirmation />} />
            <Route
              path="/booking/confirmation/:id/:roomTypeId"
              element={<BookingConfirmation />}
            />

            {/* 마이페이지: 프로필/찜 */}
            <Route path="/mypage/profile" element={<MyPage />} />
            <Route path="/mypage/wishlist" element={<Favorites />} />

            {/* 마이페이지: 예약 내역
                - /mypage/reservations: 실제 경로
                - /mypage/bookings   : alias (기존 링크 호환)
                - /mypage            : 기본 진입은 reservations로 리다이렉트 */}
            <Route path="/mypage" element={<Navigate to="/mypage/reservations" replace />} />
            <Route path="/mypage/reservations" element={<Reservations />} />
            <Route path="/mypage/bookings" element={<Reservations />} />

            {/* 챗봇 */}
            <Route path="/chatbot" element={<Chatbotpages />} />

            {/* 검색 */}
            <Route path="/search" element={<SearchPage />} />

            {/* 기타 상세 (중복 경로가 많아 보이는데, 현재 로직 유지) */}
            <Route path="/accommodations1/:id" element={<AccommodationDetail />} />

            {/* 국내 카테고리 */}
            <Route path="/accommodations/jeju" element={<JejuAccommodations />} />
            <Route path="/accommodations/detail/:id" element={<AccommodationDetail />} />
            <Route path="/accommodations/seoul" element={<SeoulAccommodations />} />
            <Route path="/accommodations/detail/:id" element={<AccommodationDetail />} />
            <Route path="/accommodations/busan" element={<BusanAccommodations />} />
            <Route path="/accommodations/detail/:id" element={<AccommodationDetail />} />
            <Route path="/accommodations/gangneung" element={<GangneungAccommodations />} />
            <Route path="/accommodations/detail/:id" element={<AccommodationDetail />} />
            <Route path="/accommodations/incheon" element={<IncheonAccommodations />} />
            <Route path="/accommodations/detail/:id" element={<AccommodationDetail />} />

            {/* 해외 카테고리 */}
            <Route path="/accommodations/fukuoka" element={<FukuokaAccommodations />} />
            <Route path="/accommodations/detail/:id" element={<AccommodationDetail />} />
            <Route path="/accommodations/bangkok" element={<BangkokAccommodations />} />
            <Route path="/accommodations/detail/:id" element={<AccommodationDetail />} />
            <Route path="/accommodations/paris" element={<ParisAccommodations />} />
            <Route path="/accommodations/detail/:id" element={<AccommodationDetail />} />
            <Route path="/accommodations/rome" element={<RomeAccommodations />} />
            <Route path="/accommodations/detail/:id" element={<AccommodationDetail />} />
            <Route path="/accommodations/singapore" element={<SingaporeAccommodations />} />

            {/* ✅ 액티비티 라우팅 */}
            <Route path="/overseas_packagepages" element={<ActivitiesMain />} />
            <Route path="/activities" element={<ActivitiesMain />} />
            <Route path="/activities/domestic" element={<DomesticActivities />} />
            <Route path="/activities/international" element={<InternationalActivities />} />
            <Route path="/activities/:type/:id" element={<ActivityDetail />} />
          </Routes>

          {/* Footer는 특정 경로에서만 제거 */}
          {!hideFooterRoutes.includes(location.pathname) && <Footer />}
        </HttpHeadersProvider>
      </AuthProvider>
    </>
  );
}

export default App;
