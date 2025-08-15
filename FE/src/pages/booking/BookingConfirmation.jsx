// src/pages/accommodations/숙소/BookingConfirmation.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../styles/pages/BookingConfirmation.css";
import { AxiosClient } from "../../api/AxiosController";
import { AuthContext } from "../../context/AuthContext";

const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [bookingData, setBookingData] = useState(null);
  const [accommodationData, setAccommodationData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let data = location.state;
      if (data?.bookingId) {
        setBookingData(data);
      } else {
        setBookingData(null);
        navigate("/")
        return;
      }
    };

    fetchData();
  }, [location.state, auth]);

  // accommodation 정보 불러오기
  useEffect(() => {
    const fetchAccommodation = async () => {
      if (bookingData?.accommodationId) {
        const res = await AxiosClient("accommodations-rooms").get(`/acc${bookingData.accommodationId}/roomtype${bookingData.roomTypeId}`);
        const INDEX = {
          NAME: 10,
          ADDRESS: 1,
          BASE_PRICE: 22,
          RTI_IMG: 23
        };

        const accommodationData = {
          name: accroom[INDEX.NAME] ?? "이름 없음",
          location: accroom[INDEX.ADDRESS] ?? "-",
          price: accroom[INDEX.BASE_PRICE] ?? 0,
          image: accroom[INDEX.RTI_IMG] ?? "",
        };
        setAccommodationData(accommodationData);
      }
    };
    fetchAccommodation();
  }, [bookingData]);

  if (!bookingData || !accommodationData) {
    return <div className="no-data">❌ 예약 정보를 찾을 수 없습니다.</div>;
  }

  const {
    name,
    phone,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    paymentMethod,
    booking_data: bookedAt,
  } = bookingData;

  return (
    <div className="booking-confirmation">
      <h2>✅ 예약이 완료되었습니다!</h2>

      {/* 숙소 정보 */}
      <div className="accommodation-summary">
        <img
          src={accommodationData.image}
          alt={accommodationData.name}
          className="summary-image"
        />
        <div className="summary-text">
          <h3>{accommodationData.name}</h3>
          <p>📍 {accommodationData.location}</p>
          <p>💰 {accommodationData.price.toLocaleString()}원</p>
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
        <button onClick={() => navigate("/mypage/bookings")}>
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
