import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/pages/AccommodationDetail.css";

import { AxiosClient } from "../../../api/AxiosController";

// ⚡ PaymentModal은 동적 로딩으로 불러옵니다(경로/대소문자 문제 회피)
// const PaymentModal = React.lazy(() => import("./PaymentModal"));

const fetchAccommodationById = async (id) => {
  try {
    const [accRes, imageRes, roomTypeRes, priceRes] = await Promise.all([
      AxiosClient("accommodations").getById(id),
      AxiosClient("accommodations/filter-img").get("", {
        params: { accommodationId: id },
      }),
      AxiosClient("room-types").get("", {
        params: { accommodation_id: id },
      }),
      AxiosClient("price-policies").getAll(),
    ]);

    const accommodation = accRes.data;
    const images = imageRes.data ?? [];
    const roomTypes = roomTypeRes.data ?? [];
    const primaryRoomType = roomTypes[0] ?? null;

    const pricePolicies = priceRes.data.filter(
      (p) => primaryRoomType && p.room_type_id === primaryRoomType.room_type_id
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
        images: (() => {
          const seen = new Set();
          return images
            .sort((a, b) => a.orderNum - b.orderNum)
            .filter((img) => {
              const cleanedUrl = img.imageUrl?.trim().toLowerCase();
              if (seen.has(cleanedUrl)) return false;
              seen.add(cleanedUrl);
              return true;
            })
            .map((img) => img.imageUrl);
        })(),
        checkIn: accommodation.checkInTime,
        checkOut: accommodation.checkOutTime,
        policies: ["금연", "반려동물 불가", "파티 불가"],
        contact: accommodation.contact ?? "000-0000-0000",
        address: accommodation.address,
        ratingAvg: accommodation.ratingAvg ?? 0,
        totalReviews: accommodation.totalReviews ?? 0,

        // 추가 필드(없을 수도 있으니 기본값)
        usageInfo: accommodation.usageInfo ?? [],
        rooms: accommodation.rooms ?? [],
      },
    };
  } catch (err) {
    console.error("fetchAccommodations error:", err);
    throw err;
  }
};

export default function AccommodationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // API 데이터
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 찜/결제 모달
  const [liked, setLiked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // 리뷰 로컬 상태
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [reviewUser, setReviewUser] = useState("");

  // 국내/해외 여부 (기존 코드 유지하되, 항상 true가 되는 OR true 제거)
  const isDomestic = window.location.pathname.includes("domestic");

  // 기본 이미지
  const fallbackImage = "/images/default-accommodation.jpg";

  useEffect(() => {
    const loadAccommodation = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchAccommodationById(id);
        setAccommodation(res.data);
        setLiked(res.data.liked);

        // 리뷰 로딩 (localStorage → 없으면 빈배열)
        const saved = localStorage.getItem(`reviews_${id}`);
        setReviews(saved ? JSON.parse(saved) : []);
      } catch (err) {
        setError(err.message || "숙소 정보를 불러오지 못했습니다.");
        console.error("Failed to fetch accommodation:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadAccommodation();
  }, [id]);

  const toggleLike = useCallback(() => {
    setLiked((prev) => !prev);
    // TODO: 서버로 찜 상태 반영 API가 있다면 호출
  }, []);

  const handleBooking = useCallback(() => {
    // 기존: navigate(`/booking/${id}`) → 결제 모달로 전환
    setShowPayment(true);
  }, []);

  const handlePaymentSuccess = (bookingData) => {
    try {
      const existingBookings =
        JSON.parse(localStorage.getItem("bookings")) || [];
      existingBookings.push({
        ...bookingData,
        bookedAt: new Date().toISOString(),
      });
      localStorage.setItem("bookings", JSON.stringify(existingBookings));
      setShowPayment(false);

      // 예약 완료 페이지로 이동
      navigate(`/booking/confirmation/${accommodation.id}`, {
        state: bookingData,
      });
    } catch (error) {
      console.error("예약 저장 중 오류:", error);
      alert("예약 처리 중 오류가 발생했습니다.");
    }
  };

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // 리뷰 저장 유틸
  const saveReviews = (updated) => {
    setReviews(updated);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));
  };

  const handleAddReview = () => {
    if (!reviewUser.trim()) return alert("이름을 입력해주세요.");
    if (!newReview.trim()) return alert("리뷰 내용을 입력해주세요.");
    const updated = [
      ...reviews,
      { user: reviewUser, rating: newRating, comment: newReview },
    ];
    saveReviews(updated);
    setReviewUser("");
    setNewReview("");
    setNewRating(5);
  };

  const handleDeleteReview = (index) => {
    const updated = reviews.filter((_, i) => i !== index);
    saveReviews(updated);
  };

  const renderStars = useCallback((rating = 0) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <div className="star-rating" aria-label={`${rating}점 만점에 ${rating}점`}>
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

  // 로딩/에러/데이터 없을 때
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
    <div className="accommodation-detail-wrapper">
      {/* 상단 이미지 영역 + 찜 버튼 */}
      <div className="image-header">
        <div className="image-preview">
          {accommodation.images && accommodation.images.length > 0 ? (
            accommodation.images.map((imageUrl, i) => (
              <img
                key={i}
                src={imageUrl}
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

      {/* 상세 정보 */}
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
          <span className="review-count">
            ({accommodation.totalReviews}개 리뷰)
          </span>
        </div>

        {accommodation.price > 0 && (
          <p className="price-info">
            <strong>1박 요금:</strong>{" "}
            {accommodation.price.toLocaleString()}원
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
                <li key={index}>{(amenity ?? "").toString()}</li>
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
          <button className="btn primary" onClick={handleBooking}>
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

      {/* 지도(간단 버전) */}
      <div className="map-placeholder">
        <h3 className="section-title">📍 지도</h3>
        <iframe
          title="지도"
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            accommodation.location || accommodation.address || ""
          )}&output=embed`}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* 리뷰 섹션(로컬 스토리지) */}
      <div className="reviews-section">
        <h3 className="section-title">📝 리뷰</h3>

        {reviews.length === 0 && (
          <p className="no-reviews">아직 등록된 리뷰가 없습니다.</p>
        )}

        {reviews.map((review, idx) => (
          <div className="review-card" key={`${review.user}-${idx}`}>
            <div className="review-header">
              <span className="review-user">{review.user}</span>
              <span className="review-stars">
                {"★".repeat(review.rating)}{" "}
                <small>({review.rating}점)</small>
              </span>
              <button
                className="review-delete"
                onClick={() => handleDeleteReview(idx)}
                aria-label="리뷰 삭제"
              >
                ✕
              </button>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}

        <div className="review-form">
          <input
            type="text"
            placeholder="이름"
            value={reviewUser}
            onChange={(e) => setReviewUser(e.target.value)}
          />
          <div className="star-rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= newRating ? "star filled" : "star"}
                onClick={() => setNewRating(star)}
                role="button"
                aria-label={`${star}점`}
              >
                ★
              </span>
            ))}
            <span style={{ marginLeft: 8 }}>{newRating}점</span>
          </div>
          <textarea
            placeholder="리뷰를 작성하세요..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          />
          <button onClick={handleAddReview}>리뷰 등록</button>
        </div>
      </div>

      {/* 결제 모달 */}
      {showPayment && (
        <React.Suspense
          fallback={
            <div className="pm-fallback">
              결제 모달을 불러오는 중입니다…
            </div>
          }
        >
          <PaymentModal
            accommodation={accommodation}
            onClose={() => setShowPayment(false)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </React.Suspense>
      )}
    </div>
  );
}
