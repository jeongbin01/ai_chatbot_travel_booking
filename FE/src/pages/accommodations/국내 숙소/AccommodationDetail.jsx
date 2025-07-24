// // src/pages/accommodations/AccommodationDetail.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "../../../styles/pages/AccommodationDetail.css";
// import noImage from "../../../assets/images/국내 지역/제주도.jpg"; // 안내 이미지 import

// export default function AccommodationDetail() {
//   const { id } = useParams(); // URL에서 숙소 ID 추출
//   const navigate = useNavigate();

//   const [accommodation, setAccommodation] = useState(null); // 숙소 상세 데이터
//   const [images, setImages] = useState([]); // 이미지 리스트
//   const [loading, setLoading] = useState(true); // 로딩 상태

//   useEffect(() => {
//     // 숙소 정보 요청
//     fetch(`/api/accommodations/${id}`)
//       .then((res) => {
//         console.log("숙소 응답 상태:", res.status);
//         return res.json();
//       })
//       .then((data) => {
//         console.log("숙소 데이터:", data);
//         setAccommodation(data);
//       })
//       .catch((err) => {
//         console.error("숙소 정보 불러오기 실패:", err);
//         setAccommodation(null);
//       });

//     // 이미지 리스트 요청
//     fetch(`/api/accommodation-images/${id}`)
//       .then((res) => {
//         console.log("이미지 응답 상태:", res.status);
//         return res.json();
//       })
//       .then((data) => {
//         console.log("이미지 데이터:", data);
//         setImages(data);
//       })
//       .catch((err) => {
//         console.error("이미지 불러오기 실패:", err);
//         setImages([]);
//       })
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) return <div className="loading">로딩 중...</div>;
//   if (!accommodation) return <div className="error">숙소 정보를 불러올 수 없습니다.</div>;

//   return (
//     <div className="accommodation-detail">
//       <h1 className="accommodation-name">{accommodation?.name}</h1>

//       <div className="image-gallery">
//         {images.length > 0 ? (
//           images.map((img) => (
//             <img
//               key={img.id}
//               src={
//                 img.url.startsWith("http")
//                   ? img.url
//                   : `http://localhost:8${img.url}`
//               }
//               alt={`숙소 이미지 ${img.id}`}
//               className="accommodation-image"
//             />
//           ))
//         ) : (
//           <div className="no-image-box">
//             <img
//               src={noImage}
//               alt="이미지 없음"
//               className="no-image-placeholder"
//             />
//             <p className="no-image-text">등록된 이미지가 없습니다.</p>
//           </div>
//         )}
//       </div>

//       <div className="accommodation-info">
//         <p><strong>주소:</strong> {accommodation?.address || "주소 정보 없음"}</p>
//         <p><strong>소개:</strong> {accommodation?.description || "소개 없음"}</p>
//       </div>

//       <button
//         className="room-button"
//         onClick={() => navigate(`/accommodations/${id}/rooms`)}
//       >
//         객실 보기 →
//       </button>
//     </div>
//   );
// }
