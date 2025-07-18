import React, { useRef } from "react";
import "../../styles/components/DomesticAccommodations.css";

import jeju from "../../assets/images/국내 지역/제주도.jpg";
import seoul from "../../assets/images/국내 지역/서울.jpg";
import busan from "../../assets/images/국내 지역/부산.jpg";
import gangneung from "../../assets/images/국내 지역/강릉.jpg";
import incheon from "../../assets/images/국내 지역/인천.jpg";
import gyeongju from "../../assets/images/국내 지역/경주.jpg";
import sokcho from "../../assets/images/국내 지역/속초.jpg";
import jeonju from "../../assets/images/국내 지역/전주.jpg";
import yeosu from "../../assets/images/국내 지역/여수.jpg";
import namhae from "../../assets/images/국내 지역/남해.jpg";

const destinations = [
  { name: "제주도", image: jeju, link: "/accommodations?region=jeju" },
  { name: "서울", image: seoul, link: "/accommodations?region=seoul" },
  { name: "부산", image: busan, link: "/accommodations?region=busan" },
  { name: "강릉", image: gangneung, link: "/accommodations?region=gangneung" },
  { name: "인천", image: incheon, link: "/accommodations?region=incheon" },
  { name: "경주", image: gyeongju, link: "/accommodations?region=gyeongju" },
  { name: "속초", image: sokcho, link: "/accommodations?region=sokcho" },
  { name: "전주", image: jeonju, link: "/accommodations?region=jeonju" },
  { name: "여수", image: yeosu, link: "/accommodations?region=yeosu" },
  { name: "남해", image: namhae, link: "/accommodations?region=namhae" },
];

function DomesticAccommodations() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="domestic-container">
      <h2 className="section-title">국내 인기 여행지</h2>
      <div className="slider-wrapper">
        <button className="arrow left" onClick={scrollLeft}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="destination-scroll" ref={scrollRef}>
          {destinations.map((item, idx) => (
            <a href={item.link} className="destination-card" key={idx}>
              <img src={item.image} alt={item.name} />
              <span>{item.name}</span>
            </a>
          ))}
        </div>
        <button className="arrow right" onClick={scrollRight}>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}

export default DomesticAccommodations;
