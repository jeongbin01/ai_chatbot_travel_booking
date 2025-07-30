import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../../styles/pages/AccommodationDetail.css";
import { AxiosClient } from "../../../api/AxiosController";

const fetchAccommodationById = async (id) => {
  try {
    const [accRes, imageRes, roomTypeRes, priceRes] = await Promise.all([
      AxiosClient("accommodations").getById(id),
      AxiosClient("accommodation-images").get("", {
        params: { accommodationId: id },
      }),
      AxiosClient("room-types").get("", {
        params: { accommodation_id: id },
      }),
      AxiosClient("price-policies").getAll(),
    ]);

    const accommodation = accRes.data;
    const images = imageRes.data ?? [];
    // console.log(imageRes)
    const roomTypes = roomTypeRes.data ?? [];

    const primaryRoomType = roomTypes[0] ?? null;

    const pricePolicies = priceRes.data.filter(
      (p) => primaryRoomType && p.room_type_id === primaryRoomType.room_type_id
    );

    const primaryPrice = pricePolicies[0] ?? null;

    return {
      data: {
        id: accommodation.accommodationId ?? accommodation.id,
        name: accommodation.name,
        location: accommodation.address,
        price: primaryPrice?.basePrice ?? 0,
        capacity: primaryRoomType?.maxOccupancy ?? 1,
        rating: accommodation.ratingAvg ?? 0,
        liked: false, // 서버 연동 시 수정
        description: accommodation.description,
        amenities: Array.isArray(accommodation.amenities)
          ? accommodation.amenities
          : [],
        images:
          images
            .sort((a, b) => a.orderNum - b.orderNum)
            .map((img) => img.imageUrl) ?? [],
        checkIn: accommodation.checkInTime,
        checkOut: accommodation.checkOutTime,
        policies: ["금연", "반려동물 불가", "파티 불가"], // 임시
        contact: accommodation.contact ?? "000-0000-0000",
        address: accommodation.address,
      },
    };
  } catch (err) {
    console.error("fetchAccommodationById error:", err);
    throw new Error("숙소 정보를 불러오는 중 문제가 발생했습니다.");
  }
};

export default function AccommodationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAccommodation = async () => {
      try {
        setLoading(true);
        const res = await fetchAccommodationById(id);
        if (isMounted) {
          setAccommodation(res.data);
          setLiked(res.data?.liked ?? false);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) loadAccommodation();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? accommodation.images.length - 1 : prev - 1
    );
  }, [accommodation?.images?.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === accommodation.images.length - 1 ? 0 : prev + 1
    );
  }, [accommodation?.images?.length]);

  const toggleLike = useCallback(() => {
    setLiked((prev) => !prev);
    // TODO: 서버 연동 시 찜 상태 API 호출
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const renderStars = useCallback((rating = 0) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <div
        className="star-rating"
        aria-label={`${rating}점 만점에 ${rating}점`}
      >
        {Array(full)
          .fill()
          .map((_, i) => (
            <i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>
          ))}
        {half && <i className="bi bi-star-half text-warning"></i>}
        {Array(empty)
          .fill()
          .map((_, i) => (
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
          <button className="btn-retry" onClick={handleBack}>
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
          <button className="btn-retry" onClick={handleBack}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-wrapper">
      <header className="detail-header">
        <button
          className="back-button"
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <i className="bi bi-arrow-left"></i>
          <span>목록으로</span>
        </button>
        <div className="header-actions">
          <button
            className={`like-button ${liked ? "liked" : ""}`}
            onClick={toggleLike}
            aria-label={liked ? "찜 해제" : "찜하기"}
          >
            <i className={`bi ${liked ? "bi-heart-fill" : "bi-heart"}`}></i>
            <span>{liked ? "찜 해제" : "찜하기"}</span>
          </button>
        </div>
      </header>

      <div className="detail-content">
        <div className="image-gallery">
          <div className="main-image-container">
            {accommodation.images?.length > 0 &&
              accommodation.images[currentImageIndex] && (
                <img
                  src={accommodation.images[currentImageIndex]}
                  alt={`${accommodation.name} 이미지 ${currentImageIndex + 1}`}
                  className="main-image"
                />
              )}
            {accommodation.images?.length > 1 && (
              <>
                <button className="image-nav prev" onClick={handlePrevImage}>
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button className="image-nav next" onClick={handleNextImage}>
                  <i className="bi bi-chevron-right"></i>
                </button>
                <div className="image-indicators">
                  {accommodation.images.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`${index + 1}번째 이미지 보기`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="detail-info">
          <div className="basic-info">
            <h1 className="accommodation-name">
              <i className="bi bi-building me-2"></i>
              {accommodation.name}
            </h1>

            <div className="location-rating">
              <p className="location">
                <i className="bi bi-geo-alt-fill me-1"></i>
                {accommodation.location}
              </p>
              <div className="rating">{renderStars(accommodation.rating)}</div>
            </div>

            <div className="price-capacity">
              <div className="price">
                <i className="bi bi-cash-coin me-1"></i>
                <span className="price-amount">
                  {accommodation.price.toLocaleString()}원
                </span>
                <span className="price-unit"> / 1박</span>
              </div>
              <div className="capacity">
                <i className="bi bi-people-fill me-1"></i>
                최대 {accommodation.capacity}명
              </div>
            </div>
          </div>

          <div className="description-section">
            <h2>
              <i className="bi bi-info-circle me-2"></i>숙소 소개
            </h2>
            <p className="description">{accommodation.description}</p>
          </div>

          <div className="amenities-section">
            <h2>
              <i className="bi bi-check2-square me-2"></i>편의시설
            </h2>
            <div className="amenities-grid">
              {accommodation.amenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <div className="check-info-section">
            <h2>
              <i className="bi bi-clock me-2"></i>체크인/체크아웃
            </h2>
            <div className="check-info">
              <div className="check-item">
                <span className="check-label">체크인:</span>
                <span className="check-time">{accommodation.checkIn}</span>
              </div>
              <div className="check-item">
                <span className="check-label">체크아웃:</span>
                <span className="check-time">{accommodation.checkOut}</span>
              </div>
            </div>
          </div>

          <div className="policies-section">
            <h2>
              <i className="bi bi-shield-check me-2"></i>숙소 규정
            </h2>
            <ul className="policies-list">
              {accommodation.policies.map((policy, index) => (
                <li key={index} className="policy-item">
                  <i className="bi bi-dot me-1"></i>
                  {policy}
                </li>
              ))}
            </ul>
          </div>

          <div className="contact-section">
            <h2>
              <i className="bi bi-telephone me-2"></i>연락처 및 위치
            </h2>
            <div className="contact-info">
              <div className="contact-item">
                <i className="bi bi-telephone-fill me-2"></i>
                <span>{accommodation.contact}</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-geo-alt-fill me-2"></i>
                <span>{accommodation.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-section">
        <div className="booking-container">
          <div className="booking-info">
            <div className="price-summary">
              <span className="total-price">
                {accommodation.price.toLocaleString()}원
              </span>
              <span className="price-per-night"> / 1박</span>
            </div>
          </div>

          <Link
            to={`/Domestic/bookings/`}
            className="btn booking-button"
          >
            예약하기
          </Link>
        </div>
      </div>
    </div>
  );
}
