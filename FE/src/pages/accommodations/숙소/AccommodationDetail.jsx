// src/pages/accommodations/숙소/AccommodationDetail.jsx
import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/pages/AccommodationDetail.css";
import { AxiosClient } from "../../../api/AxiosController";

/** 특정 숙소의 편의시설을 가져오되, 실패해도 빈 배열로 폴백 */
async function fetchAmenitiesForAccommodation(accId) {
  // 1) ?accommodationId=
  try {
    const res = await AxiosClient("amenities").get("", {
      params: { accommodationId: accId },
    });
    const data = Array.isArray(res?.data) ? res.data : [];
    return data
      .map((a) => (typeof a === "string" ? a : (a?.name ?? a?.title ?? "")))
      .filter(Boolean);
  } catch (e1) {
    console.warn("[amenities] ?accommodationId 실패 → accommodation_id 시도", e1);
  }

  // 2) ?accommodation_id=
  try {
    const res = await AxiosClient("amenities").get("", {
      params: { accommodation_id: accId },
    });
    const data = Array.isArray(res?.data) ? res.data : [];
    return data
      .map((a) => (typeof a === "string" ? a : (a?.name ?? a?.title ?? "")))
      .filter(Boolean);
  } catch (e2) {
    console.warn("[amenities] ?accommodation_id 실패 → 하위 리소스 시도", e2);
  }

  // 3) /accommodations/{id}/amenities
  try {
    const res = await AxiosClient(`accommodations/${accId}/amenities`).get();
    const data = Array.isArray(res?.data) ? res.data : [];
    return data
      .map((a) => (typeof a === "string" ? a : (a?.name ?? a?.title ?? "")))
      .filter(Boolean);
  } catch (e3) {
    console.warn("[amenities] /accommodations/{id}/amenities 실패 → 단수 리소스 시도", e3);
  }

  // 4) /accommodations/{id}/amenity (혹시 단수 매핑인 경우)
  try {
    const res = await AxiosClient(`accommodations/${accId}/amenity`).get();
    const data = Array.isArray(res?.data) ? res.data : [];
    return data
      .map((a) => (typeof a === "string" ? a : (a?.name ?? a?.title ?? "")))
      .filter(Boolean);
  } catch (e4) {
    console.warn("[amenities] 모든 시도 실패 → 빈 배열 폴백", e4);
    return [];
  }
}

/**
 * 숙소 상세 + 이미지 + 객실 + 가격 + 편의시설 병렬 로드
 */
const fetchAccommodationById = async (id) => {
  try {
    const [accRes, imageRes, roomTypeRes, priceRes] = await Promise.all([
      AxiosClient("accommodations").getById(id),
      AxiosClient("accommodation-images").get("", { params: { accommodationId: id } }),
      AxiosClient("room-types").get("", { params: { accommodationId: id } }),
      AxiosClient("price-policies").getAll(),
    ]);

    // 안전 파싱
    const acc = accRes?.data ?? {};
    const images = Array.isArray(imageRes?.data) ? imageRes.data : [];
    const roomTypes = Array.isArray(roomTypeRes?.data) ? roomTypeRes.data : [];
    const allPolicies = Array.isArray(priceRes?.data) ? priceRes.data : [];

    // 편의시설 (서버 호출 → 없으면 acc.amenities 폴백)
    let amenities = await fetchAmenitiesForAccommodation(id);
    if (amenities.length === 0 && Array.isArray(acc?.amenities)) {
      amenities = acc.amenities
        .map((a) => (typeof a === "string" ? a : (a?.name ?? a?.title ?? "")))
        .filter(Boolean);
    }

    // 기본 객실/가격
    const primaryRoomType = roomTypes[0] ?? null;
    const policiesForPrimary = primaryRoomType
      ? allPolicies.filter((p) => {
          const pRtId = p.roomTypeId ?? p.room_type_id ?? p.roomType?.id;
          const rtId =
            primaryRoomType.id ??
            primaryRoomType.roomTypeId ??
            primaryRoomType.room_type_id;
          return pRtId === rtId;
        })
      : [];
    const primaryPrice = policiesForPrimary[0] ?? null;

    // 이미지 정렬 + 중복 제거 + fallback
    const imageUrls = (() => {
      const seen = new Set();
      return images
        .slice()
        .sort(
          (a, b) =>
            (a.orderNum ?? a.order_num ?? 0) - (b.orderNum ?? b.order_num ?? 0)
        )
        .map((img) => (img.imageUrl ?? img.url ?? "").trim() || "/images/default-accommodation.jpg")
        .filter((url) => !seen.has(url) && (seen.add(url), true));
    })();

    // 정책 문자열 정규화
    const rawPolicies = acc.policies ?? acc.policyList ?? [];
    const policyList = Array.isArray(rawPolicies)
      ? rawPolicies.map((p) =>
          typeof p === "string" ? p : (p?.name ?? p?.title ?? JSON.stringify(p))
        )
      : [];

    return {
      data: {
        id: acc.accommodationId ?? acc.id ?? Number(id),
        name: acc.name ?? "",
        location: acc.address ?? "",
        address: acc.address ?? "",
        description: acc.description ?? "",
        ratingAvg: acc.ratingAvg ?? 0,
        totalReviews: acc.totalReviews ?? 0,
        checkIn: acc.checkInTime ?? acc.check_in_time ?? "-",
        checkOut: acc.checkOutTime ?? acc.check_out_time ?? "-",
        contact: acc.contact ?? "000-0000-0000",

        capacity:
          primaryRoomType?.maxOccupancy ?? primaryRoomType?.max_occupancy ?? 1,
        price: primaryPrice?.basePrice ?? primaryPrice?.base_price ?? 0,

        images: imageUrls,
        amenities,            // 문자열 배열
        policies: policyList, // 문자열 배열
        usageInfo: Array.isArray(acc.usageInfo) ? acc.usageInfo : [],
        rooms: Array.isArray(acc.rooms) ? acc.rooms : [],

        liked: !!acc.liked,
        rating: acc.ratingAvg ?? 0,
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
  const [showPayment, setShowPayment] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [reviewUser, setReviewUser] = useState("");

  const fallbackImage = "/images/default-accommodation.jpg";

  // 언마운트 가드
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
    // TODO: 서버 반영 필요 시 추가
  }, []);

  const handleBooking = useCallback(() => setShowPayment(true), []);

  const handlePaymentSuccess = (bookingData) => {
    try {
      const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];
      existingBookings.push({ ...bookingData, bookedAt: new Date().toISOString() });
      localStorage.setItem("bookings", JSON.stringify(existingBookings));
      setShowPayment(false);
      navigate(`/booking/confirmation/${accommodation.id}`, { state: bookingData });
    } catch (e) {
      console.error("예약 저장 중 오류:", e);
      alert("예약 처리 중 오류가 발생했습니다.");
    }
  };

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

      {/* 편의시설 (아이콘 없이 텍스트만) */}
      {accommodation.amenities?.length > 0 && (
        <section className="detail-section">
          <h2>편의시설</h2>
          <ul className="amenities-list">
            {accommodation.amenities.map((am, i) => (
              <li key={`${am}-${i}`}>{am}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 이용 안내 */}
      <section className="detail-section">
        <h2>이용 안내</h2>
        <p><strong>체크인</strong> : {accommodation.checkIn || "-"}</p>
        <p><strong>체크아웃</strong> : {accommodation.checkOut || "-"}</p>
        <p><strong>연락처</strong> : {accommodation.contact}</p>
        {accommodation.capacity && <p><strong>최대 인원</strong> : {accommodation.capacity}명</p>}
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
                <img src={room.imageUrl || fallbackImage} alt={`${room.name} 이미지`} />
                <div className="room-info-card">
                  <h3>{room.name}</h3>
                  {room.capacity && <div>최대 인원: {room.capacity}명</div>}
                  {room.price && (
                    <div className="room-price">
                      {Number(room.price).toLocaleString("ko-KR")}원/박
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 숙소 정책 */}
      {accommodation.policies?.length > 0 && (
        <section className="detail-section">
          <h2>숙소 정책</h2>
          <ul className="room-info-list">
            {accommodation.policies.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
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

      {/* 결제 모달 */}
      {showPayment && (
        <Suspense fallback={<div className="no-data">결제 모달을 불러오는 중입니다…</div>}>
          <PaymentModal
            accommodation={accommodation}
            onClose={() => setShowPayment(false)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Suspense>
      )}
    </div>
  );
}