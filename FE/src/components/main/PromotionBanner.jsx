import React, { useState, useEffect, useRef } from "react";
import "../../styles/components/PromotionBanner.css";

import jeju from "../../assets/images/프로모션(이벤트)/제주도 여름 특가.jpg";
import busan from "../../assets/images/프로모션(이벤트)/부산 해운대 특가.jpg";
import sokcho from "../../assets/images/프로모션(이벤트)/속초해변캠핑.jpg";
import gangneung from "../../assets/images/프로모션(이벤트)/강릉 기차.jpg";

const promotions = [
  { id: 1, title: "제주도 여름 특가", desc: "에메랄드빛 해변과 함께하는 3박 4일", image: jeju, link: "/promotion/jeju" },
  { id: 2, title: "부산 해운대 특가", desc: "숙소+카페 패키지 20% 할인", image: busan, link: "/promotion/busan" },
  { id: 3, title: "속초 바다 캠핑", desc: "청정 자연 속 힐링 여행", image: sokcho, link: "/promotion/sokcho" },
  { id: 4, title: "강릉 감성 기차여행", desc: "KTX 타고 떠나는 1박 2일", image: gangneung, link: "/promotion/gangneung" },
];

const PromotionBanner = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const groupSize = isMobile ? 1 : 2;
  const slides = [];

  for (let i = 0; i < promotions.length; i += groupSize) {
    slides.push(promotions.slice(i, i + groupSize));
  }

  const totalSlides = slides.length;
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalRef.current);
  }, [totalSlides]);

  return (
    <section className="event-banner-section">
      <div className="event-banner-wrapper">
        <button className={`event-arrow left ${currentSlide === 0 ? "disabled" : ""}`} onClick={prevSlide}>
          <i className="bi bi-chevron-left" />
        </button>

        <div className="event-slider-outer">
          <div className="event-slider-inner" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((group, index) => (
              <div className="promo-slide-group" key={index}>
                {group.map((event) => (
                  <a href={event.link} key={event.id} className="promo-card">
                    <img src={event.image} alt={event.title} className="promo-image" />
                    <div className="promo-overlay">
                      <span className="promo-badge">NOLDAY</span>
                      <h3 className="promo-title">{event.title}</h3>
                      <p className="promo-desc">{event.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          className={`event-arrow right ${currentSlide === totalSlides - 1 ? "disabled" : ""}`}
          onClick={nextSlide}
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      <div className="slide-indicators">
        {slides.map((_, idx) => (
          <span key={idx} className={`dot ${idx === currentSlide ? "active" : ""}`} />
        ))}
      </div>
    </section>
  );
};

export default PromotionBanner;
