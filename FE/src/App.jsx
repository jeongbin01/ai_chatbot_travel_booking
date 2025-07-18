// src/App.js

import React from 'react';

import Header from './components/common/Header';
import HeroBanner from './components/main/HeroBanner';
import PromotionBanner from './components/main/PromotionBanner';
import DomesticAccommodations from './components/product/DomesticAccommodations';
import OverseasAccommodations from './components/product/OverseasAccommodations';
import TimeSaleSection from './components/main/TimeSaleSection';
import Footer from './components/common/Footer';

function App() {
  return (
    <>
      <Header />
      <HeroBanner />
      <PromotionBanner />
      <DomesticAccommodations />
      <OverseasAccommodations />
      <TimeSaleSection />
      <Footer />
    </>
  );
}

export default App;
