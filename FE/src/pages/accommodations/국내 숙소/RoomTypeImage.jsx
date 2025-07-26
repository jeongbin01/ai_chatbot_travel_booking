// src/pages/RoomTypeImagePage.jsx
import React, { useEffect, useState } from "react";

export default function RoomTypeImagePage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8888/api/room-type-images") // 기본 조회 API 필요 시 추가
      .then((res) => res.json())
      .then((data) => setImages(data));
  }, []);

  return (
    <div>
      <h2>객실 유형 이미지</h2>
      <ul>
        {images.map((img) => (
          <li key={img.id}>
            <img src={img.url} alt={`Image ${img.id}`} style={{ width: 200 }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
