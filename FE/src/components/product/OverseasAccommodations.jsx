// src/components/OverseasAccommodations.jsx
import React from "react";
import "../../styles/components/OverseasAccommodations.css";

import fukuoka from "../../assets/images/해외 지역/호쿠오카.jpg";
import bangkok from "../../assets/images/해외 지역/방콕.jpg";
import paris from "../../assets/images/해외 지역/파리.jpg";
import rome from "../../assets/images/해외 지역/로마.jpg";
import singapore from "../../assets/images/해외 지역/싱카프로.jpg";

const destinations = [
  { name: "후쿠오카", image: fukuoka, link: "/accommodations/fukuoka" },
  { name: "방콕", image: bangkok, link: "/accommodations/bangkok" },
  { name: "파리", image: paris, link: "/accommodations/paris" },
  { name: "로마", image: rome, link: "/accommodations/rome" },
  { name: "싱가포르", image: singapore, link: "/accommodations/singapore"}
];

function OverseasAccommodations() {
  return (
    <section className="domestic-container">
      <h2 className="section-title">해외 인기 여행지</h2>

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

export default OverseasAccommodations;
