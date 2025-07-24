// src/pages/accommodations/언구 숙소/AccommodationPage.jsx
import React, { useEffect, useState } from "react";
import Accommodation from "../../accommodations/국내 숙소/DomesticHome";
import "../../../styles/pages/AccommodationCard.css";

export default function AccommodationCardPage() {
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8888/api/accommodations")
      .then((res) => res.json())
      .then((data) => setAccommodations(data))
      .catch((error) => console.error("숙소 데이터 로드 실패:", error));
  }, []);

  return (
    <div className="accommodation-page">
      <h2> 전체 숙소 목록</h2>
      <div className="accommodation-grid">
        {accommodations.length === 0 ? (
          <p className="no-data">숙소 정보가 없습니다.</p>
        ) : (
          accommodations.map((acc) => (
            <Accommodation
              key={acc.id}
              accommodation={acc}
              onClick={() => console.log("숙소 선택:", acc.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}