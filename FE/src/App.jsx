// src/App.js

import React from 'react';

import Header from './components/common/Header';
import HeroBanner from './components/main/HeroBanner';
import PromotionBanner from './components/main/PromotionBanner';
import DomesticAccommodations from './components/product/DomesticAccommodations';
import OverseasAccommodations from './components/product/OverseasAccommodations';
import TimeSaleSection from './components/main/TimeSaleSection';
import Footer from './components/common/Footer';
import AugustTripList from './components/main/AugustTripList';
import ReviewSlider from './components/review/ReviewSlider';
import TopTravelProducts from './components/product/TopTravelProducts';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import ChatbotShortcut from './components/common/ChatbotShortcut';

function App() {
  return (
    <>
      <Header />
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
      <Footer />
    </>
  );
}

export default App;
