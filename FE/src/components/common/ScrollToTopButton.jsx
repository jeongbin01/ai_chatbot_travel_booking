import React, { useEffect, useState } from 'react';
import '../../styles/components/ScrollToTopButton.css';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button className="scroll-to-top" onClick={scrollToTop} aria-label="맨 위로 이동">
      <i className="bi bi-arrow-up"></i>
    </button>
  );
};

export default ScrollToTopButton;
