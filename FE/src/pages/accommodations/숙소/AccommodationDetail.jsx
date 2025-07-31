// AccommodationDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosClient } from "../../../api/AxiosController";
import "../../../styles/pages/AccommodationDetail.css";

import gangneungImg from "../../../assets/images/domestic/강릉.jpg";
import sokchoImg from "../../../assets/images/domestic/속초.jpg";
import yeosuImg from "../../../assets/images/domestic/여수.jpg";
import incheonImg from "../../../assets/images/domestic/인천.jpg";
import jejuImg from "../../../assets/images/domestic/제주도.jpg";
import romaImg from "../../../assets/images/overseas/로마.jpg";
import bangkokImg from "../../../assets/images/overseas/방콕.jpg";
import singaporeImg from "../../../assets/images/overseas/싱카프로.jpg";
import parisImg from "../../../assets/images/overseas/로마.jpg";

const DOMESTIC_IMAGES = {
  "강릉 게스트하우스": gangneungImg,
  "속초 리조트": sokchoImg,
  "여수 게스트하우스": yeosuImg,
  "인천 비즈니스 호텔": incheonImg,
  "제주도 오션뷰 펜션": jejuImg,
};

const OVERSEAS_IMAGES = {
  "로마 부티크 호텔": romaImg,
  "방콕 리버사이드 호텔": bangkokImg,
  "싱가포르 시티 호텔": singaporeImg,
  "파리 센강 호텔": parisImg,
};

export default function AccommodationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [accRes, imgRes] = await Promise.all([
          AxiosClient("accommodations").getById(id),
          AxiosClient("accommodation-images").get("", {
            params: { accommodationId: id },
          }),
        ]);
        setAccommodation(accRes.data);
        setImages(imgRes.data ?? []);
      } catch {
        alert("숙소 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (!accommodation)
    return <div className="error">숙소 정보를 찾을 수 없습니다.</div>;

  const isDomestic = accommodation.isDomestic === "Y";
  const fallbackImage = (isDomestic ? DOMESTIC_IMAGES : OVERSEAS_IMAGES)[
    accommodation.name
  ];

  return (
    <div className="accommodation-detail-wrapper">
      <div className="image-header">
        <div className="image-preview">
          {images.length > 0 ? (
            images.map((img, i) => (
              <img
                key={i}
                src={img.imageUrl}
                alt="숙소 이미지"
                className="gallery-img"
              />
            ))
          ) : (
            <img src={fallbackImage} alt="기본 숙소" className="gallery-img" />
          )}
        </div>
        <button
          className={`like-button ${liked ? "liked" : ""}`}
          onClick={() => setLiked(!liked)}
          aria-label="찜하기"
        >
          <i className={`bi ${liked ? "bi-heart-fill" : "bi-heart"}`} />
        </button>
      </div>

      <div className="acc-detail-info">
        <h2 className="acc-detail-title">{accommodation.name}</h2>
        <p className="acc-detail-address">
          <i className="bi bi-geo-alt-fill me-1" />
          {accommodation.address}
        </p>
        <p><strong>설명:</strong> {accommodation.description}</p>
        <p><strong>체크인:</strong> {accommodation.checkInTime}</p>
        <p><strong>체크아웃:</strong> {accommodation.checkOutTime}</p>
        <p><strong>연락처:</strong> {accommodation.contact}</p>
        <p><strong>평점:</strong> ⭐ {accommodation.ratingAvg} ({accommodation.totalReviews}개 리뷰)</p>

        <div className="action-buttons">
          <button className="btn-reserve">예약하기</button>
          <button
            className="btn-back"
            onClick={() =>
              navigate(isDomestic ? "/domesticpages" : "/overseaspages")
            }
          >
            목록으로
          </button>
        </div>
      </div>

      <div className="map-placeholder">📍 지도 위치 (추후 구현)</div>
      <div className="reviews-placeholder">📝 리뷰 목록 (추후 구현)</div>
    </div>
  );
}
