import React from 'react'

import HeroBanner from './components/main/HeroBanner';
import MainPage from './components/main/MainPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function App() {
  return (
    <>
    <Header />
    <HeroBanner />
    <MainPage />
    <Footer />
    </>
  );
}

export default App;
