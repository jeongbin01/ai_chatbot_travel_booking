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
import ScrollToTopButton from './components/common/ScrollToTopButton';

function App() {
  return (
    <>
      <Header />
      <HeroBanner />
      <PromotionBanner />
      <DomesticAccommodations />
      <OverseasAccommodations />
      <TimeSaleSection />
      <AugustTripList />
      <ReviewSlider />
      <ScrollToTopButton />
      <Footer />
    </>
  );
}

export default App;
