import React from "react";
import "../../styles/components/TopTravelProducts.css";

import gimhae from "../../assets/images/domestic/김해 호텔.jpg";
import rome from "../../assets/images/overseas/로마 호텔.jpg";
import busan from "../../assets/images/domestic/강릉 호텔.jpg";
import paris from "../../assets/images/overseas/파리 호텔.jpg";
import incheon from "../../assets/images/domestic/순천 한옥 호텔.jpg";

const destinations = [
  { name: "김해 역사 호텔", image: gimhae , link: "/domesticpages/20" },
  { name: "로마 부티크 호텔", image: rome, link: "/overseaspages/21" },
  { name: "강릉 경포 호텔", image: busan, link: "/domesticpages/5" },
  { name: "파리 센강 호텔", image: paris, link: "/overseaspages/24" },
  { name: "순천 한옥 호텔", image: incheon, link: "/domesticpages/16" }
];


function TopTravelProducts() {
  return (
    <section className="domestic-container">
      <h2 className="section-title">무더운 여름 지금이 바로 여행 예약 타이밍!</h2>

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

export default TopTravelProducts;
