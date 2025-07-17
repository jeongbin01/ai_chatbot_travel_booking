import React, { useRef } from 'react';
import "../../styles/components/PromotionBanner.css";

// 🔽 이미지 임포트 (실제 사용하려면 주석 해제하세요)
// import jeju from "../../assets/images/promotions/jeju.jpg";
// import busan from "../../assets/images/promotions/busan.jpg";
// import osaka from "../../assets/images/promotions/osaka.jpg";

// 🔽 현재는 직접 경로 문자열로 이미지 사용 중
const promotions = [
  {
    id: 1,
    title: "제주도 여름 특가",
    desc: "에메랄드빛 해변과 함께하는 3박 4일",
    image: "/images/promotions/jeju.jpg",
    link: "/promotion/jeju"
  },
  {
    id: 2,
    title: "부산 해운대 특가",
    desc: "숙소+카페 패키지 20% 할인",
    image: "/images/promotions/busan.jpg",
    link: "/promotion/busan"
  },
  {
    id: 3,
    title: "속초 바다 캠핑",
    desc: "청정 자연 속 힐링 여행",
    image: "/images/promotions/sokcho.jpg",
    link: "/promotion/sokcho"
  },
  {
    id: 4,
    title: "강릉 감성 기차여행",
    desc: "KTX 타고 떠나는 1박 2일",
    image: "/images/promotions/gangneung.jpg",
    link: "/promotion/gangneung"
  },
  {
    id: 5,
    title: "오사카 벚꽃 여행",
    desc: "항공+숙소 포함 자유여행",
    image: "/images/promotions/osaka.jpg",
    link: "/promotion/osaka"
  },
  {
    id: 6,
    title: "방콕 시티 바캉스",
    desc: "5성급 호텔 포함 3박 5일 패키지",
    image: "/images/promotions/bangkok.jpg",
    link: "/promotion/bangkok"
  },
  {
    id: 7,
    title: "괌 가족 여행",
    desc: "가족 맞춤형 리조트 특가",
    image: "/images/promotions/guam.jpg",
    link: "/promotion/guam"
  },
  {
    id: 8,
    title: "하와이 썸머 세일",
    desc: "최대 30% 할인! 낙원에서의 여름",
    image: "/images/promotions/hawaii.jpg",
    link: "/promotion/hawaii"
  }
];

const PromotionBanner = () => {
  const scrollRef = useRef();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -220, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
  };

  return (
    <section className="promo-carousel-section">
      <h3 className="promo-carousel-title">이벤트</h3>
      <div className="promo-carousel-wrapper">
        <button className="promo-btn left" onClick={scrollLeft}>&lt;</button>
        <div className="promo-carousel-container" ref={scrollRef}>
          {promotions.map((item) => (
            <a key={item.id} href={item.link} className="promo-carousel-card">
              <img src={item.image} alt={item.title} />
              <p className="promo-carousel-text">{item.title}</p>
            </a>
          ))}
        </div>
        <button className="promo-btn right" onClick={scrollRight}>&gt;</button>
      </div>
    </section>
  );
};

export default PromotionBanner;