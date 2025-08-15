// src/pages/accommodations/숙소/AccommodationDetail.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/pages/AccommodationDetail.css";
import { AxiosClient } from "../../../api/AxiosController";

/**
 * 숙소 상세 + 이미지 + 객실 + 가격 병렬 로드
 */
const fetchAccommodationById = async (id) => {
  try {
    const [accroomData] = await Promise.all([
      AxiosClient("accommodations-rooms").getById(id)
    ]);
    const accroomData0 = accroomData.data[0]
    console.log(accroomData)
    const INDEX = {
      ACCOMMODATION_ID: 0,
      ADDRESS: 1,
      CHECK_IN_TIME: 2,
      CHECK_OUT_TIME: 3,
      CONTACT: 4,
      DESCRIPTION: 5,
      IS_ACTIVE: 6,
      IS_DOMESTIC: 7,
      LATITUDE: 8,
      LONGITUDE: 9,
      NAME: 10,
      RATING_AVG: 11,
      REGISTRATION_DATE: 12,
      TOTAL_REVIEWS: 13,
      TYPE: 14,
      OWNER_USER_ID: 15,
      IMAGE_URL: 16,
      ROOM_TYPE_ID: 17,
      BED_TYPE: 18,
      ROOM_DESCRIPTION: 19,
      MAX_OCCUPANCY: 20,
      ROOM_NAME: 21,
      BASE_PRICE: 22,
      RTI_IMG : 23
    };
    const rooms = accroomData.data.map(accroom => ({
      roomTypeId: accroom[INDEX.ROOM_TYPE_ID] ?? null,
      roomName: accroom[INDEX.ROOM_NAME] ?? "",
      bedType: accroom[INDEX.BED_TYPE] ?? "",
      description: accroom[INDEX.ROOM_DESCRIPTION] ?? "",
      maxOccupancy: accroom[INDEX.MAX_OCCUPANCY] ?? 1,
      basePrice: accroom[INDEX.BASE_PRICE] ?? 0,
      imageUrl: (accroom[INDEX.RTI_IMG] ?? accroom[INDEX.IMAGE_URL]) ?? ""
    }));
    console.log(rooms);
    return {
      data: {
        id: accroomData0[INDEX.ACCOMMODATION_ID],
        name: accroomData0[INDEX.NAME],
        latitude: accroomData0[INDEX.LATITUDE],
        longitude: accroomData0[INDEX.LONGITUDE],
        address: accroomData0[INDEX.ADDRESS],
        description: accroomData0[INDEX.DESCRIPTION] ?? "",
        ratingAvg: accroomData0[INDEX.RATING_AVG] ?? 0,
        totalReviews: accroomData0[INDEX.TOTAL_REVIEWS] ?? 0,
        checkIn: accroomData0[INDEX.CHECK_IN_TIME] ?? "-",
        checkOut: accroomData0[INDEX.CHECK_OUT_TIME] ?? "-",
        contact: accroomData0[INDEX.CONTACT] ?? "000-0000-0000",
        capacity: accroomData0[INDEX.MAX_OCCUPANCY] ?? 1,
        price: accroomData0[INDEX.BASE_PRICE] ?? 0,
        images: [accroomData0[INDEX.IMAGE_URL] ?? ""],
        usageInfo: [],
        rooms: rooms,
        liked:0, // 이건 DB에서 가져오려면 SELECT에 추가 필요
        rating: accroomData0[INDEX.RATING_AVG] ?? 0,
        },
    };
  } catch (err) {
    console.error("fetchAccommodationById error:", err);
    throw err;
  }
};

export default function AccommodationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [liked, setLiked] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [reviewUser, setReviewUser] = useState("");

  const fallbackImage = "/images/default-accommodation.jpg";

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchAccommodationById(id);
        if (ignore) return;

        setAccommodation(res.data);
        setLiked(!!res.data.liked);

        const saved = localStorage.getItem(`reviews_${id}`);
        setReviews(saved ? JSON.parse(saved) : []);
      } catch (err) {
        if (!ignore) setError(err?.message || "숙소 정보를 불러오지 못했습니다.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [id]);

  const toggleLike = useCallback(() => {
    setLiked((prev) => !prev);
  }, []);

  const handleBooking = useCallback(() => {
    navigate(`/booking/${id}`);
  }, [navigate, id]);

  const handleBack = useCallback(() => navigate(-1), [navigate]);

  const saveReviews = (updated) => {
    setReviews(updated);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));
  };

  const handleAddReview = () => {
    if (!reviewUser.trim()) return alert("이름을 입력해주세요.");
    if (!newReview.trim()) return alert("리뷰 내용을 입력해주세요.");
    const updated = [
      ...reviews,
      { user: reviewUser.trim(), rating: newRating, comment: newReview.trim() },
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
        {Array(full).fill().map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill text-warning" />
        ))}
        {half && <i className="bi bi-star-half text-warning" />}
        {Array(empty).fill().map((_, i) => (
          <i key={`empty-${i}`} className="bi bi-star text-muted" />
        ))}
        <span className="rating-text ms-1">({rating})</span>
      </div>
    );
  }, []);

  if (loading) {
    return <div className="accommodation-detail"><div className="no-data">숙소 정보를 불러오는 중...</div></div>;
  }
  if (error) {
    return (
      <div className="accommodation-detail">
        <div className="no-data">
          <i className="bi bi-exclamation-triangle me-2" />
          {error}
          <div style={{ marginTop: 12 }}>
            <button className="book-button" onClick={handleBack}>목록으로 돌아가기</button>
          </div>
        </div>
      </div>
    );
  }
  if (!accommodation) {
    return (
      <div className="accommodation-detail">
        <div className="no-data">
          <i className="bi bi-house-x me-2" /> 숙소 정보를 찾을 수 없습니다.
          <div style={{ marginTop: 12 }}>
            <button className="book-button" onClick={handleBack}>목록으로 돌아가기</button>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = accommodation.images?.[0] || fallbackImage;
  const hasMapTarget = Boolean(accommodation.location || accommodation.address);

  return (
    <div className="accommodation-detail">
      {/* 상단 대표 이미지 + 기본 정보 */}
      <div className="detail-main-card">
        <img src={mainImage} alt={`${accommodation.name} 대표 이미지`} />
        <div className="detail-main-info">
          <h1>{accommodation.name}</h1>
          <div className="detail-location">
            <i className="bi bi-geo-alt-fill me-1" /> {accommodation.address}
          </div>
          <div className="detail-rating">
            {renderStars(accommodation.ratingAvg)}{" "}
            <span className="review-count">({accommodation.totalReviews}개 리뷰)</span>
          </div>
          {accommodation.price > 0 && (
            <div className="detail-price">
              1박 {Number(accommodation.price).toLocaleString("ko-KR")}원
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button className="main-book-button" onClick={handleBooking}>예약하기</button>
            <button
              className="book-button"
              style={{ padding: "10px 16px" }}
              onClick={toggleLike}
              aria-pressed={liked}
              aria-label={liked ? "찜 해제" : "찜하기"}
            >
              <i className={`bi ${liked ? "bi-heart-fill" : "bi-heart"}`} /> 찜
            </button>
          </div>
        </div>
      </div>

      {/* 설명 */}
      {accommodation.description && (
        <section className="detail-section">
          <h2>설명</h2>
          <p>{accommodation.description}</p>
        </section>
      )}

      {/* 이용 안내 */}
      <section className="detail-section">
        <h2>이용 안내</h2>
        <p><strong>체크인</strong> : {accommodation.checkIn || "-"}</p>
        <p><strong>체크아웃</strong> : {accommodation.checkOut || "-"}</p>
        <p><strong>연락처</strong> : {accommodation.contact}</p>
        {accommodation.rooms.map(room => room.maxOccupancy).join("/")}명
      </section>

      {/* 이용 팁 */}
      {accommodation.usageInfo?.length > 0 && (
        <section className="detail-section usage-info">
          <h2>이용 팁</h2>
          <ul>{accommodation.usageInfo.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
        </section>
      )}

      {/* 객실 정보 */}
      {accommodation.rooms?.length > 0 && (
        <section className="detail-section">
          <h2>객실 안내</h2>
          <div className="rooms-container">
            {accommodation.rooms.map((room, i) => (
              <div className="room-card" key={i}>
                <img 
                  src={room.imageUrl || fallbackImage} 
                  alt={`${room.roomName || "객실"} 이미지`} 
                />
                <h3>{room.roomName || "객실 이름 없음"}</h3>

                {room.maxOccupancy && (
                  <div>최대 인원: {room.maxOccupancy}명</div>
                )}

                {room.basePrice !== undefined && (
                  <div>{Number(room.basePrice).toLocaleString("ko-KR")}원/박</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 지도 */}
      {hasMapTarget && (
        <section className="detail-section map-section">
          <h2>지도</h2>
          <iframe
            title="지도"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              accommodation.location || accommodation.address || ""
            )}&output=embed`}
            width="100%"
            height="300"
            loading="lazy"
          />
        </section>
      )}

      {/* 리뷰 */}
      <section className="detail-section">
        <h2>리뷰</h2>
        {reviews.length === 0 && (
          <div className="no-data" style={{ padding: 16 }}>
            아직 등록된 리뷰가 없습니다.
          </div>
        )}
        {reviews.map((review, idx) => (
          <div className="review-card" key={`${idx}-${review.user}`}>
            <div className="review-header">
              <span className="review-user">{review.user}</span>
              <span className="review-stars">
                {"★".repeat(review.rating)} <small>({review.rating}점)</small>
              </span>
              <button className="review-delete" onClick={() => handleDeleteReview(idx)}>✕</button>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
        {/* 리뷰 작성 폼 */}
        <div className="review-form">
          <input
            type="text"
            placeholder="이름"
            value={reviewUser}
            onChange={(e) => setReviewUser(e.target.value)}
          />
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= newRating ? "star filled" : "star"}
                onClick={() => setNewRating(star)}
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
      </section>
    </div>
  );
}
