// src/pages/accommodations/숙소/AccommodationDetail.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/pages/AccommodationDetail.css";
import { AxiosClient } from "../../../api/AxiosController";

// ✅ 찜 훅만 유지
import useWishlistClient from "../../../hooks/useWishlistClient";

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

    // ✅ 숫자 강제 변환(백엔드 문자열/NULL 대비)
    const ratingAvgNum = Number(head[INDEX.RATING_AVG] ?? 0);
    const totalReviewsNum = Number(head[INDEX.TOTAL_REVIEWS] ?? 0);

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
        ratingAvg: Number.isFinite(ratingAvgNum) ? ratingAvgNum : 0,
        totalReviews: Number.isFinite(totalReviewsNum) ? totalReviewsNum : 0,
        checkIn: head[INDEX.CHECK_IN_TIME] ?? "-",
        checkOut: head[INDEX.CHECK_OUT_TIME] ?? "-",
        contact: head[INDEX.CONTACT] ?? "000-0000-0000",
        capacity: head[INDEX.MAX_OCCUPANCY] ?? null,
        price: head[INDEX.BASE_PRICE] ?? null,
        images: firstImage ? [firstImage] : [],
        usageInfo: [],
        rooms,
        liked: 0,
        rating: Number.isFinite(ratingAvgNum) ? ratingAvgNum : 0,
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

  // ✅ 찜 훅 사용
  const { isWished, toggleWish } = useWishlistClient();
  const isFavorite = isWished(id);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [reviewUser, setReviewUser] = useState("");

  // ✏️ 수정 모드 상태
  const [editIndex, setEditIndex] = useState(-1);
  const [editUser, setEditUser] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

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

  // ✅ 헤더 요약: **로컬 리뷰만 기준** (항상 리스트와 일치)
  const headerReviewCount = reviews.length;
  const headerAvg = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  // ✅ 리뷰 섹션 요약(로컬 리뷰 기준)
  const summaryTotal = reviews.length;
  const summaryAvgText = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // ✅ 찜 토글
  const handleToggleWish = useCallback(() => {
    if (!accommodation) return;
    toggleWish({
      id: accommodation.id,
      name: accommodation.name,
      image: accommodation.images?.[0] || fallbackImage,
      location: accommodation.address || "",
      price: accommodation.price ?? (accommodation.rooms?.[0]?.basePrice ?? 0),
    });
  }, [accommodation, toggleWish]);

  const handleBooking = useCallback(() => {
    navigate(`/booking/${id}`);
  }, [navigate, id]);

  const handleBack = useCallback(() => navigate(-1), [navigate]);

  const saveReviews = (updated) => {
    setReviews(updated);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updated));
  };

  // ✅ 등록
  const handleAddReview = () => {
    const name = reviewUser.trim();
    const comment = newReview.trim();
    if (!name) return alert("이름을 입력해주세요.");
    if (!comment) return alert("리뷰 내용을 입력해주세요.");

    const newItem = {
      id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
      user: name,
      rating: Number(newRating) || 0,
      comment,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };

    const updated = [newItem, ...reviews]; // 최신이 위로
    saveReviews(updated);

    setReviewUser("");
    setNewReview("");
    setNewRating(5);
  };

  // 🗑 삭제(확인)
  const handleDeleteReview = (index) => {
    const target = reviews[index];
    if (!target) return;
    const ok = window.confirm(
      `이 리뷰를 삭제할까요?\n- 작성자: ${target.user}\n- 내용: ${target.comment}`
    );
    if (!ok) return;
    const updated = reviews.filter((_, i) => i !== index);
    saveReviews(updated);
    if (editIndex === index) cancelEdit(); // 수정 중이면 초기화
  };

  // ✏️ 수정 시작
  const startEdit = (index) => {
    const r = reviews[index];
    if (!r) return;
    setEditIndex(index);
    setEditUser(r.user);
    setEditRating(Number(r.rating) || 0);
    setEditComment(r.comment);
  };

  // 💾 수정 저장
  const saveEdit = () => {
    if (editIndex < 0) return;
    const name = editUser.trim();
    const comment = editComment.trim();
    if (!name) return alert("이름을 입력해주세요.");
    if (!comment) return alert("리뷰 내용을 입력해주세요.");

    const updated = reviews.map((r, i) =>
      i === editIndex
        ? {
            ...r,
            user: name,
            rating: Number(editRating) || 0,
            comment,
            updatedAt: new Date().toISOString(),
          }
        : r
    );
    saveReviews(updated);
    cancelEdit();
  };

  // ❌ 수정 취소
  const cancelEdit = () => {
    setEditIndex(-1);
    setEditUser("");
    setEditRating(5);
    setEditComment("");
  };

  // ✅ 제출 가능 여부(버튼 활성/비활성)
  const canSubmit = useMemo(
    () => reviewUser.trim().length > 0 && newReview.trim().length > 0,
    [reviewUser, newReview]
  );

  // ✅ 숫자 강제 렌더링 (평점)
  const renderStars = useCallback((rating = 0) => {
    const r = Number(rating) || 0;
    const full = Math.floor(r);
    const half = r % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <div className="star-rating" aria-label={`${r}점 만점에 ${r}점`}>
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
        <span className="rating-text ms-1">({r})</span>
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
    if (hasCoords) return `${accommodation.latitude},${accommodation.longitude}`;
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
            {renderStars(headerAvg)}{" "}
            {headerReviewCount > 0 ? (
              <span className="review-count">({headerReviewCount}개 리뷰)</span>
            ) : (
              <span className="review-count text-muted">(리뷰 없음)</span>
            )}
          </div>
          {accommodation.price > 0 && (
            <div className="detail-price">
              1박 {Number(accommodation.price).toLocaleString("ko-KR")}원
            </div>
          )}
          <div className="action-row">
            <button className="main-book-button" onClick={handleBooking}>
              예약하기
            </button>

            {/* ✅ 찜 버튼 */}
            <button
              className="book-button"
              style={{ padding: "10px 16px" }}
              onClick={handleToggleWish}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "찜 해제" : "찜하기"}
              type="button"
            >
              <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`} /> 찜
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

        {/* 리뷰 섹션 요약: 로컬 리뷰 기준 */}
        <div className="d-flex align-items-center gap-2 mb-2">
          <i className="bi bi-star-fill text-warning" />
          <strong className="me-1">{summaryAvgText}</strong>
          <span className="text-muted">/ 5</span>
          <span className="vr mx-2" />
          <i className="bi bi-chat-square-text text-muted" />
          <span className="text-muted">{summaryTotal}개 리뷰</span>
        </div>

        {/* 리뷰 없음 */}
        {reviews.length === 0 && (
          <div className="no-data" style={{ padding: 16 }}>
            <i className="bi bi-info-circle me-2 text-muted" />
            아직 등록된 리뷰가 없습니다.
          </div>
        )}

        {/* 리뷰 목록 (최신순) */}
        {reviews.map((review, idx) => {
          const isEditing = editIndex === idx;

          if (isEditing) {
            return (
              <div className="review-card" key={review.id ?? `${idx}-edit`}>
                <div className="review-header">
                  <span className="review-user">
                    <i className="bi bi-pencil-square me-1 text-primary" />
                    리뷰 수정
                  </span>

                  <span className="review-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`bi ${
                          star <= editRating
                            ? "bi-star-fill text-warning"
                            : "bi-star text-muted"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setEditRating(star)}
                        role="button"
                        aria-label={`${star}점 선택`}
                      />
                    ))}
                    <small className="ms-1">({editRating}점)</small>
                  </span>

                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={saveEdit}
                      title="저장"
                    >
                      <i className="bi bi-check-lg" /> 저장
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={cancelEdit}
                      title="취소"
                    >
                      <i className="bi bi-x-lg" /> 취소
                    </button>
                  </div>
                </div>

                <div className="input-group mb-2">
                  <span className="input-group-text">
                    <i className="bi bi-person" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="이름"
                    value={editUser}
                    onChange={(e) => setEditUser(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-chat-dots" />
                  </span>
                  <textarea
                    className="form-control"
                    placeholder="리뷰 내용을 수정하세요."
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    maxLength={500}
                  />
                </div>
                <div className="text-end text-muted small mt-1">
                  {editComment.length}/500
                </div>
              </div>
            );
          }

          // 일반 표시 모드
          return (
            <div className="review-card" key={review.id ?? `${idx}-${review.user}`}>
              <div className="review-header">
                {/* 작성자 */}
                <span className="review-user">
                  <i
                    className="bi bi-person-circle me-1 text-primary"
                    aria-hidden="true"
                  />
                  {review.user}
                </span>

                {/* 평점 */}
                <span
                  className="review-stars"
                  aria-label={`평점 ${review.rating}점`}
                >
                  {Array(Number(review.rating) || 0)
                    .fill()
                    .map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning" />
                    ))}
                  <small className="ms-1">({review.rating}점)</small>
                </span>

                {/* 액션 */}
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => startEdit(idx)}
                    title="수정"
                  >
                    <i className="bi bi-pencil-square" /> 수정
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteReview(idx)}
                    title="삭제"
                  >
                    <i className="bi bi-trash3" /> 삭제
                  </button>
                </div>
              </div>

              {/* 내용 */}
              <p className="review-comment">{review.comment}</p>
            </div>
          );
        })}

        {/* 작성 폼 */}
        <div className="review-form">
          {/* 이름 */}
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
              aria-label="이름"
            />
          </div>

          {/* 별점 */}
          <div className="star-rating mb-2 d-flex align-items-center">
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
                role="button"
                aria-label={`${star}점 선택`}
              />
            ))}
            <span className="ms-2">{newRating}점</span>
          </div>

          {/* 코멘트 */}
          <div className="mb-2">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-chat-dots" />
              </span>
              <textarea
                className="form-control"
                placeholder="리뷰를 작성하세요."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                maxLength={500}
                aria-label="리뷰 내용"
              />
            </div>
            <div className="text-end text-muted small mt-1">
              {newReview.length}/500
            </div>
          </div>

          {/* 등록 버튼 (조건 충족 시만 활성화) */}
          <button
            className="btn btn-primary"
            onClick={handleAddReview}
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
            title={canSubmit ? "리뷰 등록" : "이름과 내용을 입력하세요"}
          >
            <i className="bi bi-pencil-square me-1" /> 리뷰 등록
          </button>
        </div>
      </section>
    </div>
  );
}
