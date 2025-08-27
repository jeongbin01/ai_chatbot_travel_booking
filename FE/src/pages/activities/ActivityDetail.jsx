import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import domestic from "./domesticActivitiesData";
import international from "./internationalActivitiesData";
import ActivityPaymentModal from "./ActivityPaymentModal";
import "../../styles/pages/ActivityDetail.css";

/** =========================
 *  상수 & 유틸 (가독성/일관성)
 *  ========================= */
const NS = "onsim";
const k = (id, part) => `${NS}:activity:${String(id)}:${part}`;
const K_RESV_LIST = `${NS}:reservations:activities`;
const TIME_OPTIONS = ["10:00", "12:00", "14:00", "16:00", "18:00"];

const safeParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const fmtKR = (n) => Number(n || 0).toLocaleString("ko-KR");

export default function ActivityDetail() {
  const { type, id } = useParams();
  const nav = useNavigate();

  /** type 안정화 */
  const safeType = useMemo(
    () => (type === "international" ? "international" : "domestic"),
    [type]
  );

  /** 대상 액티비티 */
  const activity = useMemo(() => {
    const pool = safeType === "domestic" ? domestic : international;
    return pool.find((a) => String(a.id) === String(id));
  }, [safeType, id]);

  /* ===== 리뷰 ===== */
  const [reviews, setReviews] = useState([]);
  const [reviewUser, setReviewUser] = useState("");
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);

  const REVIEWS_KEY = useMemo(() => k(id, "reviews"), [id]);

  useEffect(() => {
    const saved = localStorage.getItem(REVIEWS_KEY);
    if (saved) setReviews(safeParse(saved, []));
  }, [REVIEWS_KEY]);

  const saveReviews = useCallback(
    (arr) => {
      setReviews(arr);
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(arr));
    },
    [REVIEWS_KEY]
  );

  const addReview = useCallback(() => {
    const user = reviewUser.trim();
    if (!user) return alert("이름을 입력하세요.");

    const entry = {
      id: Date.now(),
      user,
      rating: clamp(Number(newRating) || 5, 1, 5),
      content: newReview.trim(),
      date: new Date().toISOString(),
    };
    saveReviews([entry, ...reviews].slice(0, 100));
    setReviewUser("");
    setNewReview("");
    setNewRating(5);
  }, [reviewUser, newRating, newReview, reviews, saveReviews]);

  const deleteReview = useCallback(
    (rid) => {
      if (!confirm("이 리뷰를 삭제할까요?")) return;
      saveReviews(reviews.filter((r) => r.id !== rid));
    },
    [reviews, saveReviews]
  );

  /* ===== 예약 ===== */
  const [date, setDate] = useState("");
  const [time, setTime] = useState(TIME_OPTIONS[0]);
  const [people, setPeople] = useState(2);
  const [showPayment, setShowPayment] = useState(false);
  const [booking, setBooking] = useState(null);

  const BOOKING_KEY = useMemo(() => k(id, "booking"), [id]);

  useEffect(() => {
    const saved = localStorage.getItem(BOOKING_KEY);
    if (saved) setBooking(safeParse(saved, null));
  }, [BOOKING_KEY]);

  const price = useMemo(() => Number(activity?.price || 0), [activity]);
  const roundedRating = useMemo(
    () => clamp(Math.round(activity?.rating ?? 0), 0, 5),
    [activity]
  );
  const totalPrice = useMemo(
    () => clamp(Number(people) || 1, 1, 9999) * price,
    [people, price]
  );

  const openPayment = useCallback(() => {
    if (!date) return alert("날짜를 선택하세요.");
    if (!time) return alert("시간을 선택하세요.");
    if (Number(people) < 1) return alert("인원은 1명 이상이어야 합니다.");
    setShowPayment(true);
  }, [date, time, people]);

  const upsertList = useCallback((payload) => {
    const list = safeParse(localStorage.getItem(K_RESV_LIST), []) || [];
    const idx = list.findIndex(
      (x) => String(x.activityId) === String(payload.activityId)
    );
    if (idx >= 0) list[idx] = payload;
    else list.unshift(payload);
    localStorage.setItem(K_RESV_LIST, JSON.stringify(list.slice(0, 200)));
  }, []);

  const removeFromList = useCallback((activityId) => {
    const list = safeParse(localStorage.getItem(K_RESV_LIST), []) || [];
    localStorage.setItem(
      K_RESV_LIST,
      JSON.stringify(
        list.filter((x) => String(x.activityId) !== String(activityId))
      )
    );
  }, []);

  const onPaid = useCallback(
    (paymentInfo) => {
      if (!activity) return;
      const payload = {
        activityId: activity.id,
        type: safeType,
        name: activity.name,
        location: activity.location,
        date,
        time,
        people: clamp(Number(people) || 1, 1, 9999),
        totalPrice,
        payment: paymentInfo,
        bookedAt: new Date().toISOString(),
        thumbnail: activity.thumbnail ?? "",
        target: "activity",
      };
      localStorage.setItem(BOOKING_KEY, JSON.stringify(payload));
      upsertList(payload);
      setBooking(payload);
      setShowPayment(false);
      alert(
        "예약이 완료되었습니다. 마이페이지 > 예약 내역에서 확인할 수 있어요."
      );
    },
    [
      activity,
      safeType,
      date,
      time,
      people,
      totalPrice,
      BOOKING_KEY,
      upsertList,
    ]
  );

  const cancelBooking = useCallback(() => {
    if (!confirm("예약을 취소할까요?")) return;
    localStorage.removeItem(BOOKING_KEY);
    removeFromList(id);
    setBooking(null);
    alert("예약이 취소되었습니다.");
  }, [BOOKING_KEY, id, removeFromList]);

  /* ===== 가드 ===== */
  if (!activity) {
    return (
      <main className="activity-detail">
        <div className="act__container">
          <p>해당 액티비티를 찾을 수 없습니다.</p>
          <button
            className="act-backlink"
            onClick={() => nav("/activities")}
            type="button"
          >
            ← 목록으로
          </button>
        </div>
      </main>
    );
  }

  /* ===== 뷰 ===== */
  return (
    <main className="activity-detail">
      <div className="act__container">
        {/* 상단 목록 버튼 */}
        <button
          className="act-backlink"
          onClick={() => nav("/activities")}
          type="button"
        >
          ← 목록으로
        </button>

        {/* 히어로: hero → act-hero 로 전면 변경 */}
        <section
          className="act-hero act-hero--split"
          aria-labelledby="act-title"
        >
          <div
            className="act-hero__media"
            role="img"
            aria-label={`${activity.name} 이미지`}
          >
            {activity.thumbnail ? (
              <img src={activity.thumbnail} alt={activity.name} />
            ) : (
              <div className="act-hero__placeholder" />
            )}
          </div>

          <div className="act-hero__meta">
            <h1 id="act-title" className="act-hero__title">
              {activity.name}
            </h1>

            <div className="act-hero__sub">
              <span aria-label="위치">📍 {activity.location}</span>
              <span className="act-dot" aria-hidden="true">
                •
              </span>
              <span aria-label="가격">가격 {fmtKR(price)}원</span>
            </div>

            <div
              className="act-stars"
              aria-label={`평점 ${activity?.rating ?? "-"} / 5`}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`act-star ${
                    i <= roundedRating ? "is-filled" : ""
                  }`}
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
              <span className="act-rating-num" aria-hidden="true">
                {activity.rating}
              </span>
            </div>

            {activity.description && (
              <p className="act-hero__desc">{activity.description}</p>
            )}
          </div>
        </section>

        {/* 예약: booking → act-booking */}
        <section className="act-booking" aria-labelledby="reserve-title">
          <h2 id="reserve-title" className="act-section-title">
            예약
          </h2>

          {booking ? (
            <div className="act-booking__saved" aria-live="polite">
              <div className="act-row">
                <div>
                  <strong>날짜</strong>
                  <div>{booking.date}</div>
                </div>
                <div>
                  <strong>시간</strong>
                  <div>{booking.time}</div>
                </div>
                <div>
                  <strong>인원</strong>
                  <div>{booking.people}명</div>
                </div>
                <div>
                  <strong>총 금액</strong>
                  <div>{fmtKR(booking.totalPrice)}원</div>
                </div>
              </div>

              <div className="act-booking__actions">
                <button
                  className="act-btn"
                  type="button"
                  onClick={() => nav("/mypage/bookings")}
                >
                  예약 내역 보기
                </button>
                <button
                  className="act-btn act-btn--ghost"
                  type="button"
                  onClick={cancelBooking}
                >
                  예약 취소
                </button>
              </div>
            </div>
          ) : (
            <form
              className="act-booking__form"
              onSubmit={(e) => {
                e.preventDefault();
                openPayment();
              }}
            >
              <div className="act-row">
                <label className="act-field">
                  <span>날짜</span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </label>

                <label className="act-field">
                  <span>시간</span>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="act-field">
                  <span>인원</span>
                  <input
                    type="number"
                    min="1"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    required
                  />
                </label>

                <div className="act-summary" aria-live="polite">
                  <span>총 금액</span>
                  <strong>{fmtKR(totalPrice)}원</strong>
                </div>
              </div>

              <div className="act-booking__actions">
                <button className="act-btn" type="submit">
                  결제하기
                </button>
              </div>
            </form>
          )}
        </section>

        {/* 리뷰: reviews → act-reviews */}
        <section className="act-reviews" aria-labelledby="review-title">
          <h2 id="review-title" className="act-section-title">
            리뷰
          </h2>

          <div className="act-review-form" role="form" aria-label="리뷰 작성">
            <div className="act-row">
              <label className="act-field">
                <span>이름 *</span>
                <input
                  type="text"
                  placeholder="이름을 입력"
                  value={reviewUser}
                  onChange={(e) => setReviewUser(e.target.value)}
                  required
                />
              </label>

              <label className="act-field">
                <span>별점 (1~5)</span>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  aria-label="별점 선택"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="act-field">
              <span>내용</span>
              <textarea
                placeholder="이용 후기를 남겨주세요"
                rows={3}
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
            </label>

            <div className="act-review-actions">
              <button className="act-btn" type="button" onClick={addReview}>
                리뷰 등록
              </button>
            </div>
          </div>

          <ul className="act-review-list" aria-live="polite">
            {reviews.length === 0 && (
              <li className="act-empty">아직 리뷰가 없습니다.</li>
            )}

            {reviews.map((r) => (
              <li key={r.id} className="act-review-item">
                <div className="act-review-item__top">
                  <strong>{r.user}</strong>
                  <div className="act-stars" aria-label={`평점 ${r.rating}/5`}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`act-star ${
                          i <= r.rating ? "is-filled" : ""
                        }`}
                        aria-hidden="true"
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {r.content && (
                  <p className="act-review-item__content">{r.content}</p>
                )}

                <div className="act-review-item__meta">
                  <span>{new Date(r.date).toLocaleString()}</span>
                  <button
                    className="act-link act-link--danger"
                    type="button"
                    onClick={() => deleteReview(r.id)}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {showPayment && (
        <ActivityPaymentModal
          amount={totalPrice}
          onClose={() => setShowPayment(false)}
          onPaymentSuccess={onPaid}
        />
      )}
    </main>
  );
}
