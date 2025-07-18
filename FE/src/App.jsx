import React from 'react';

import HeroBanner from './components/main/HeroBanner';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PromotionBanner from './components/main/PromotionBanner';
import DomesticAccommodations from './components/product/DomesticAccommodations';
import OverseasAccommodations from './components/product/OverseasAccommodations';
import TopTravelProducts from './components/product/TopTravelProducts';

function App() {
  return (
    <>
      <Header />
      <HeroBanner />
      <PromotionBanner />
      <DomesticAccommodations />
      <OverseasAccommodations />
      <TopTravelProducts />
      <Footer />
    </>
  );
}

export default App;
