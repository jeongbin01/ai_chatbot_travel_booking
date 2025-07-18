import React, { useState, useEffect, useRef, useMemo } from "react";
import "../../styles/components/PromotionBanner.css";

import jeju from "../../assets/images/프로모션(이벤트)/제주도 여름 특가.jpg";
import busan from "../../assets/images/프로모션(이벤트)/부산 해운대 특가.jpg";
import sokcho from "../../assets/images/프로모션(이벤트)/속초해변캠핑.jpg";
import gangneung from "../../assets/images/프로모션(이벤트)/강릉 기차.jpg";
import hawaii from "../../assets/images/프로모션(이벤트)/하와이.jpg";
import osaka from "../../assets/images/프로모션(이벤트)/오사카 여행.jpg";
import bangkok from "../../assets/images/프로모션(이벤트)/방콕 시티 호강스.jpeg";
import guam from "../../assets/images/프로모션(이벤트)/괌 가족 리조트.jpg";


const BADGE_SEQUENCE = ["HOT", "NEW", "SALE", "특가", "추천", "인기", "NOLDAY"];

const rawPromotions = [
  { id: 1, title: "제주도 여름 특가", desc: "에메랄드빛 해변과 함께하는 3박 4일", image: jeju, link: "/promotion/jeju" },
  { id: 2, title: "부산 해운대 특가", desc: "숙소+카페 패키지 20% 할인", image: busan, link: "/promotion/busan" },
  { id: 3, title: "속초 바다 캠핑", desc: "청정 자연 속 힐링 여행", image: sokcho, link: "/promotion/sokcho" },
  { id: 4, title: "강릉 감성 기차여행", desc: "KTX 타고 떠나는 1박 2일", image: gangneung, link: "/promotion/gangneung" },
  { id: 5, title: "하와이 썸머 세일", desc: "최대 30% 할인! 낙원에서의 여름", image: hawaii, link: "/promotion/hawaii" },
  { id: 6, title: "오사카 벚꽃 여행", desc: "항공+숙소 포함 자유여행 패키지", image: osaka, link: "/promotion/osaka" },
  { id: 7, title: "방콕 시티 호컁스", desc: "5성급 호텔 포함 3박 5일 일정", image: bangkok, link: "/promotion/bangkok" },
  { id: 8, title: "괌 가족 여행 특가", desc: "아이와 함께하는 가족 맞춤 리조트", image: guam, link: "/promotion/guam" },
];


const PromotionBanner = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const intervalRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = useMemo(() => {
    const withBadge = rawPromotions.map((item, idx) => ({
      ...item,
      badge: BADGE_SEQUENCE[idx % BADGE_SEQUENCE.length],
    }));

    const groupSize = isMobile ? 1 : 2;
    const groups = [];

    for (let i = 0; i < withBadge.length; i += groupSize) {
      groups.push(withBadge.slice(i, i + groupSize));
    }

    return groups;
  }, [isMobile]);

  const totalSlides = slides.length;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

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
        <button
          className={`event-arrow left ${currentSlide === 0 ? "disabled" : ""}`}
          onClick={prevSlide}
        >
          <i className="bi bi-chevron-left" />
        </button>

        <div className="event-slider-outer">
          <div
            className="event-slider-inner"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((group, index) => (
              <div className="promo-slide-group" key={index}>
                {group.map((event) => (
                  <a href={event.link} key={event.id} className="promo-card">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="promo-image"
                    />
                    <div className="promo-overlay">
                      <span className="promo-badge">{event.badge}</span>
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
          className={`event-arrow right ${
            currentSlide === totalSlides - 1 ? "disabled" : ""
          }`}
          onClick={nextSlide}
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      <div className="slide-indicators">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentSlide ? "active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
};

export default PromotionBanner;
