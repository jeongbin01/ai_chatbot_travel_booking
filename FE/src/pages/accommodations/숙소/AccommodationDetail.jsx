import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/pages/AccommodationDetail.css";

import { AxiosClient } from "../../../api/AxiosController";

const fetchAccommodationById = async (id) => {
  try {
    const [accRes, imageRes, roomTypeRes, priceRes] = await Promise.all([
      AxiosClient("accommodations").getById(id),
      AxiosClient("accommodation-images").get("", {
        params: { accommodation_id: id },
      }),
      AxiosClient("room-types").get("", {
        params: { accommodation_id: id },
      }),
      AxiosClient("price-policies").getAll(), // 여긴 아직 전체 받아오는 방식
    ]);

    const accommodation = accRes.data;
    const images = imageRes.data ?? [];
    const roomTypes = roomTypeRes.data ?? [];

    const primaryRoomType = roomTypes[0] ?? null;

    const pricePolicies = priceRes.data.filter(p =>
      primaryRoomType && p.room_type_id === primaryRoomType.room_type_id
    );

    const primaryPrice = pricePolicies[0] ?? null;

    return {
      data: {
        id: accommodation.accommodationId,
        name: accommodation.name,
        location: accommodation.address,
        price: primaryPrice?.basePrice ?? 0,
        capacity: primaryRoomType?.maxOccupancy ?? 1,
        rating: accommodation.ratingAvg ?? 0,
        liked: false,
        description: accommodation.description,
        amenities: Array.isArray(accommodation.amenities)
          ? accommodation.amenities
          : [],
        images: images
          .sort((a, b) => a.orderNum - b.orderNum)
          .map(img => img.imageUrl),
        checkIn: accommodation.checkInTime,
        checkOut: accommodation.checkOutTime,
        policies: ["금연", "반려동물 불가", "파티 불가"], // 임시
        contact: accommodation.contact ?? "000-0000-0000", // 임시
        address: accommodation.address,
        ratingAvg: accommodation.ratingAvg ?? 0,
        totalReviews: accommodation.totalReviews ?? 0,
      },
    };
  } catch (err) {
    console.error("fetchAccommodations error:", err);
    throw err;
  }
}

export default function AccommodationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  // 국내/해외 여부 판단 (URL 또는 다른 로직으로 결정)
  const isDomestic = window.location.pathname.includes('domestic') || true; // 기본값을 국내로 설정
  
  // 기본 이미지 fallback
  const fallbackImage = "/images/default-accommodation.jpg";

  useEffect(() => {
    const loadAccommodation = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchAccommodationById(id);
        setAccommodation(res.data);
        setLiked(res.data.liked);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch accommodation:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAccommodation();
    }
  }, [id]);

  const toggleLike = useCallback(() => {
    setLiked(!liked);
    // 실제로는 서버에 찜 상태를 저장하는 API 호출
  }, [liked]);

  const handleBooking = useCallback(() => {
    if (accommodation) {
      navigate(`/booking/${id}`);
    }
  }, [accommodation, navigate, id]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const renderStars = useCallback((rating = 0) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    
    return (
      <div className="star-rating" aria-label={`${rating}점 만점에 ${rating}점`}>
        {Array(full).fill().map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>
        ))}
        {half && <i className="bi bi-star-half text-warning"></i>}
        {Array(empty).fill().map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star text-muted"></i>
        ))}
        <span className="rating-text ms-1">({rating})</span>
      </div>
    );
  }, []);

  if (loading) {
    return (
      <div className="detail-wrapper">
        <div className="loading" role="status" aria-live="polite">
          <div className="spinner"></div>
          <span>숙소 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-wrapper">
        <div className="error-message">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button 
            className="btn-retry"
            onClick={handleBack}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="detail-wrapper">
        <div className="no-results">
          <i className="bi bi-house-x me-2"></i>
          숙소 정보를 찾을 수 없습니다.
          <button 
            className="btn-retry"
            onClick={handleBack}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="accommodation-detail-wrapper">
      <div className="image-header">
        <div className="image-preview">
          {accommodation.images && accommodation.images.length > 0 ? (
            accommodation.images.map((imageUrl, i) => (
              <img
                key={i}
                src={
                  imageUrl.startsWith("http")
                    ? imageUrl
                    : `/images/accommodation/${imageUrl}`
                }
                alt={`${accommodation.name} 이미지 ${i + 1}`}
                className="gallery-img"
              />
            ))
          ) : (
            <img src={fallbackImage} alt="기본 숙소" className="gallery-img" />
          )}
        </div>
        <button
          className={`like-button ${liked ? "liked" : ""}`}
          onClick={toggleLike}
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
        
        {accommodation.description && (
          <p>
            <strong>설명:</strong> {accommodation.description}
          </p>
        )}
        
        {accommodation.checkIn && (
          <p>
            <strong>체크인:</strong> {accommodation.checkIn}
          </p>
        )}
        
        {accommodation.checkOut && (
          <p>
            <strong>체크아웃:</strong> {accommodation.checkOut}
          </p>
        )}
        
        <p>
          <strong>연락처:</strong> {accommodation.contact}
        </p>
        
        <div className="rating-section">
          <strong>평점:</strong> 
          {renderStars(accommodation.ratingAvg)}
          <span className="review-count">({accommodation.totalReviews}개 리뷰)</span>
        </div>

        {accommodation.price > 0 && (
          <p className="price-info">
            <strong>1박 요금:</strong> {accommodation.price.toLocaleString()}원
          </p>
        )}

        {accommodation.capacity && (
          <p>
            <strong>최대 인원:</strong> {accommodation.capacity}명
          </p>
        )}

        {accommodation.amenities && accommodation.amenities.length > 0 && (
          <div className="amenities-section">
            <strong>편의시설:</strong>
            <ul>
              {accommodation.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        )}

        {accommodation.policies && accommodation.policies.length > 0 && (
          <div className="policies-section">
            <strong>숙소 정책:</strong>
            <ul>
              {accommodation.policies.map((policy, index) => (
                <li key={index}>{policy}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="button-group">
          <button
            className="btn primary"
            onClick={handleBooking}
          >
            예약하기
          </button>
          <button
            className="btn outline"
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