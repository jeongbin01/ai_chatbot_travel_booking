import React from "react";
import "../../styles/components/DomesticAccommodations.css";

import jeju from "../../assets/images/국내 지역/제주도.jpg";
import seoul from "../../assets/images/국내 지역/서울.jpg";
import busan from "../../assets/images/국내 지역/부산.jpg";
import gangneung from "../../assets/images/국내 지역/강릉.jpg";
import incheon from "../../assets/images/국내 지역/인천.jpg";

const destinations = [
  { name: "제주도", image: jeju, link: "/accommodations/jeju" },
  { name: "서울", image: seoul, link: "/accommodations/seoul" },
  { name: "부산", image: busan, link: "/accommodations/busan" },
  { name: "강릉", image: gangneung, link: "/accommodations/gangneung" },
  { name: "인천", image: incheon, link: "/accommodations/incheon" }
];

function DomesticAccommodations() {
  return (
    <section className="domestic-container">
      <h2 className="section-title">국내 인기 여행지</h2>

      <div className="slider-wrapper">
        <div className="destination-scroll">
          {destinations.map((item, idx) => (
            <a href={item.link} className="destination-card" key={idx}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DomesticAccommodations;
