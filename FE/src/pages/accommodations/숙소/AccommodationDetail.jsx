// src/pages/accommodations/숙소/AccommodationDetail.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/pages/AccommodationDetail.css";
import { AxiosClient } from "../../../api/AxiosController";

/**
 * 숙소 상세 + 이미지 + 객실 + 가격 병렬 로드
 */
const fetchAccommodationById = async (id) => {
  try {
    const [accroomData] = await Promise.all([
      AxiosClient("accommodations-rooms").getById(id),
    ]);

    const rows = accroomData?.data ?? [];
    if (!Array.isArray(rows) || rows.length === 0) {
      return { data: null };
    }

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
      RTI_IMG: 23,
    };

    const head = rows[0];

    const rooms = rows.map((r) => ({
      roomTypeId: r[INDEX.ROOM_TYPE_ID] ?? null,
      roomName: r[INDEX.ROOM_NAME] ?? "",
      bedType: r[INDEX.BED_TYPE] ?? "",
      description: r[INDEX.ROOM_DESCRIPTION] ?? "",
      maxOccupancy: r[INDEX.MAX_OCCUPANCY] ?? 1,
      basePrice: r[INDEX.BASE_PRICE] ?? 0,
      imageUrl: r[INDEX.RTI_IMG] ?? r[INDEX.IMAGE_URL] ?? "",
    }));

    const firstImage = head[INDEX.IMAGE_URL] ?? "";
    const latitude = head[INDEX.LATITUDE];
    const longitude = head[INDEX.LONGITUDE];

    return {
      data: {
        id: head[INDEX.ACCOMMODATION_ID],
        name: head[INDEX.NAME],
        latitude:
          typeof latitude === "number" ? latitude : parseFloat(latitude ?? ""),
        longitude:
          typeof longitude === "number"
            ? longitude
            : parseFloat(longitude ?? ""),
        address: head[INDEX.ADDRESS],
        description: head[INDEX.DESCRIPTION] ?? "",
        ratingAvg: head[INDEX.RATING_AVG] ?? 0,
        totalReviews: head[INDEX.TOTAL_REVIEWS] ?? 0,
        checkIn: head[INDEX.CHECK_IN_TIME] ?? "-",
        checkOut: head[INDEX.CHECK_OUT_TIME] ?? "-",
        contact: head[INDEX.CONTACT] ?? "000-0000-0000",
        capacity: head[INDEX.MAX_OCCUPANCY] ?? null,
        price: head[INDEX.BASE_PRICE] ?? null,
        images: firstImage ? [firstImage] : [],
        usageInfo: [],
        rooms,
        liked: 0,
        rating: head[INDEX.RATING_AVG] ?? 0,
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
        setLiked(!!res.data?.liked);

        const saved = localStorage.getItem(`reviews_${id}`);
        setReviews(saved ? JSON.parse(saved) : []);
      } catch (err) {
        if (!ignore)
          setError(err?.message || "숙소 정보를 불러오지 못했습니다.");
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
      <div
        className="star-rating"
        aria-label={`${rating}점 만점에 ${rating}점`}
      >
        {Array(full)
          .fill()
          .map((_, i) => (
            <i key={`full-${i}`} className="bi bi-star-fill text-warning" />
          ))}
        {half && <i className="bi bi-star-half text-warning" />}
        {Array(empty)
          .fill()
          .map((_, i) => (
            <i key={`empty-${i}`} className="bi bi-star text-muted" />
          ))}
        <span className="rating-text ms-1">({rating})</span>
      </div>
    );
  }, []);

  const hasCoords =
    accommodation &&
    typeof accommodation.latitude === "number" &&
    !Number.isNaN(accommodation.latitude) &&
    typeof accommodation.longitude === "number" &&
    !Number.isNaN(accommodation.longitude);

  const hasAddress = accommodation && !!accommodation.address;
  const hasMapTarget = hasCoords || hasAddress;

  const mapQuery = useMemo(() => {
    if (!accommodation) return "";
    if (hasAddress) return accommodation.address;
    if (hasCoords)
      return `${accommodation.latitude},${accommodation.longitude}`;
    return "";
  }, [accommodation, hasAddress, hasCoords]);

  const mapSrc = useMemo(() => {
    const q = mapQuery ? encodeURIComponent(mapQuery) : "";
    return `https://www.google.com/maps?q=${q}&hl=ko&z=15&output=embed`;
  }, [mapQuery]);

  if (loading) {
    return (
      <div className="accommodation-detail">
        <div className="no-data">숙소 정보를 불러오는 중...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="accommodation-detail">
        <div className="no-data">
          <i className="bi bi-exclamation-triangle me-2" />
          {error}
          <div style={{ marginTop: 12 }}>
            <button className="book-button" onClick={handleBack}>
              목록으로 돌아가기
            </button>
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
            <button className="book-button" onClick={handleBack}>
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = accommodation.images?.[0] || fallbackImage;

  return (
    <div className="accommodation-detail">
      {/* 상단 대표 이미지 + 기본 정보 */}
      <div className="detail-main-card">
        {/* ⬇️ 이미지 래퍼 추가 (flex-wrap 문제 방지) */}
        <div className="detail-media">
          <img
            src={mainImage}
            alt={`${accommodation.name} 대표 이미지`}
            loading="lazy"
          />
        </div>

        <div className="detail-main-info">
          <h1>{accommodation.name}</h1>
          <div className="detail-location">
            <i className="bi bi-geo-alt-fill me-1" /> {accommodation.address}
          </div>
          <div className="detail-rating">
            {renderStars(accommodation.ratingAvg)}{" "}
            <span className="review-count">
              ({accommodation.totalReviews}개 리뷰)
            </span>
          </div>
          {accommodation.price > 0 && (
            <div className="detail-price">
              1박 {Number(accommodation.price).toLocaleString("ko-KR")}원
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button className="main-book-button" onClick={handleBooking}>
              예약하기
            </button>
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
        <p>
          <strong>체크인</strong> : {accommodation.checkIn || "-"}
        </p>
        <p>
          <strong>체크아웃</strong> : {accommodation.checkOut || "-"}
        </p>
        <p>
          <strong>연락처</strong> : {accommodation.contact}
        </p>
        {Array.isArray(accommodation.rooms) &&
          accommodation.rooms.length > 0 && (
            <p>
              <strong>객실 인원</strong> :{" "}
              {accommodation.rooms
                .map((room) => room?.maxOccupancy)
                .filter((v) => v != null)
                .join("/")}
              명
            </p>
          )}
      </section>

      {/* 이용 팁 */}
      {accommodation.usageInfo?.length > 0 && (
        <section className="detail-section usage-info">
          <h2>이용 팁</h2>
          <ul>
            {accommodation.usageInfo.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
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
                  loading="lazy"
                />
                <h3>{room.roomName || "객실 이름 없음"}</h3>

                {room.maxOccupancy && (
                  <div>최대 인원: {room.maxOccupancy}명</div>
                )}

                {room.basePrice !== undefined && room.basePrice !== null && (
                  <div>
                    {Number(room.basePrice).toLocaleString("ko-KR")}원/박
                  </div>
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
            src={mapSrc}
            width="100%"
            height="300"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
          />
        </section>
      )}

      {/* 리뷰 */}
      <section className="detail-section">
        <h2>리뷰</h2>

        {reviews.length === 0 && (
          <div className="no-data" style={{ padding: 16 }}>
            <i className="bi bi-info-circle me-2 text-muted" />
            아직 등록된 리뷰가 없습니다.
          </div>
        )}

        {reviews.map((review, idx) => (
          <div className="review-card" key={`${idx}-${review.user}`}>
            <div className="review-header">
              <span className="review-user">
                <i className="bi bi-person-circle me-1 text-primary" />
                {review.user}
              </span>
              <span className="review-stars">
                {Array(review.rating)
                  .fill()
                  .map((_, i) => (
                    <i key={i} className="bi bi-star-fill text-warning" />
                  ))}
                <small className="ms-1">({review.rating}점)</small>
              </span>
              <button
                className="review-delete"
                onClick={() => handleDeleteReview(idx)}
                aria-label="리뷰 삭제"
              >
                <i className="bi bi-trash3 text-danger" />
              </button>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}

        {/* 리뷰 작성 폼 */}
        <div className="review-form">
          <div className="input-group mb-2">
            <span className="input-group-text">
              <i className="bi bi-person" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="이름"
              value={reviewUser}
              onChange={(e) => setReviewUser(e.target.value)}
            />
          </div>

          <div className="star-rating mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi ${
                  star <= newRating
                    ? "bi-star-fill text-warning"
                    : "bi-star text-muted"
                }`}
                style={{ cursor: "pointer", fontSize: "1.3rem" }}
                onClick={() => setNewRating(star)}
              />
            ))}
            <span className="ms-2">{newRating}점</span>
          </div>

          <div className="mb-2">
            <textarea
              className="form-control"
              placeholder="리뷰를 작성하세요..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" onClick={handleAddReview}>
            <i className="bi bi-pencil-square me-1" /> 리뷰 등록
          </button>
        </div>
      </section>
    </div>
  );
}
