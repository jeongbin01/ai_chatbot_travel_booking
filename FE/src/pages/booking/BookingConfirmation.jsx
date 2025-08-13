// src/pages/accommodations/숙소/BookingConfirmation.jsx
import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import "../../styles/pages/BookingConfirmation.css";
import { AxiosClient } from "../../api/AxiosController";
import { AuthContext } from "../../context/AuthContext";

const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  /**
   * 1. location.state로 예약 데이터가 전달되었는지 확인
   * 2. 없다면 localStorage에서 해당 숙소 ID의 최근 예약 정보 검색
   */

  let bookingData = location.state;
  if (!bookingData) {
    bookingData = AxiosClient("bookings", auth.token).getById(id);
  }
  console.log(bookingData.accommodationId)
  const accomodationData = AxiosClient("accommodations").getById(bookingData.accommodationId);
  console.log("Accomodation : " ,accomodationData)
  if (!bookingData && !accomodationData) {
    return <div className="no-data">❌ 예약 정보를 찾을 수 없습니다.</div>;
  }

  
  // console.log(bookingData)
  const {
    accommodation=accomodationData,
    name,
    phone,
    checkIn,
    checkOut,
    paymentMethod,
    bookedAt,
  } = bookingData;

  return (
    <div className="booking-confirmation">
      <h2>✅ 예약이 완료되었습니다!</h2>

      {/* 숙소 정보 */}
      <div className="accommodation-summary">
        <img
          src={accommodation.image}
          alt={accommodation.name}
          className="summary-image"
        />
        <div className="summary-text">
          <h3>{accommodation.name}</h3>
          <p>📍 {accommodation.location}</p>
          <p>💰 {accommodation.price.toLocaleString()}원</p>
        </div>
      </div>

      {/* 예약자 정보 */}
      <div className="booking-info">
        <p><strong>예약자명:</strong> {name || "이름 미입력"}</p>
        <p><strong>전화번호:</strong> {phone || "전화번호 미입력"}</p>
        <p><strong>체크인:</strong> {checkIn || "-"}</p>
        <p><strong>체크아웃:</strong> {checkOut || "-"}</p>
        <p><strong>결제수단:</strong> {paymentMethod === "card" ? "신용/체크카드" : "계좌이체"}</p>
        <p><strong>예약일시:</strong> {bookedAt ? new Date(bookedAt).toLocaleString() : "-"}</p>
      </div>

      {/* 버튼 */}
      <div className="actions">
        <button onClick={() => navigate("/bookings")}>
          📋 내 예약 목록 보기
        </button>
        <button onClick={() => navigate("/")}>
          🏠 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
