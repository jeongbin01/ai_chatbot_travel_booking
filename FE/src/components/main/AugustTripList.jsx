import React from 'react';
import '../../styles/components/AugustTripList.css';

import jeju from "../../assets/images/국내 지역/제주도.jpg";
import seoul from "../../assets/images/국내 지역/서울.jpg";
import busan from "../../assets/images/국내 지역/부산.jpg";

const sampleTrips = [
  {
    id: 1,
    title: "[서울/제주 출발] 제주도 3박 4일",
    image: jeju,
    tags: ["#에메랄드 해변", "#감귤체험"],
    price: 299000,
    badge: "행운특가",
    link: "/accommodations?region=jeju"
  },
  {
    id: 2,
    title: "[서울 출발] 서울 시티 투어 2박 3일",
    image: seoul,
    tags: ["#한강 야경", "#전통시장"],
    price: 199000,
    badge: "베스트셀러",
    link: "/accommodations?region=seoul"
  },
  {
    id: 3,
    title: "[부산 출발] 부산 해운대 3일 자유여행",
    image: busan,
    tags: ["#해운대", "#광안리", "#미포철길"],
    price: 219000,
    badge: "여름한정",
    link: "/accommodations?region=busan"
  }
];

function AugustTripList() {
  return (
    <section className="august-section">
      <h2 className="august-title">8월 스페셜 여행 모음</h2>
      <p className="august-subtitle">놓치면 후회할 여름 특가 최대 70% 할인</p>

      <div className="trip-grid">
        {sampleTrips.map(trip => (
          <a href={trip.link} key={trip.id} className="trip-card">
            <img src={trip.image} alt={trip.title} className="trip-img" />
            <div className="trip-info">
              <h3 className="trip-title">{trip.title}</h3>
              <div className="trip-tags">
                {trip.tags.map((tag, i) => (
                  <span key={i} className="trip-tag">{tag}</span>
                ))}
              </div>
              <div className="trip-price">
                <strong>{trip.price.toLocaleString()}원~</strong>
              </div>
              <div className="trip-badge">{trip.badge}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default AugustTripList;
