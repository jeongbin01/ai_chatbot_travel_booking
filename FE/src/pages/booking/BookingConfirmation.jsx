// src/pages/accommodations/숙소/BookingConfirmation.jsx
import "../../styles/pages/BookingConfirmation.css";
import { useParams, useLocation, useNavigate } from "react-router-dom"
import React, { useState, useContext, useEffect } from "react";
import { AxiosClient } from "../../api/AxiosController";
import { AuthContext } from "../../context/AuthContext";
import { ssrExportNameKey } from "vite/module-runner";

const BookingConfirmation = () => {
  const { accommodationId, roomTypeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(null); // navigate로 받은 기본 예약 식별 데이터
  const [accommodationData, setAccommodationData] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null); // 실제 예약 상세 정보
  const { auth } = useContext(AuthContext);
  // 예약 데이터 세팅 (state or URL params)
  useEffect(() => {
    let data = location.state;
    if (data?.accommodationId) {
      setBookingData(data);
    } else if (accommodationId && roomTypeId) {
      setBookingData({
        accommodationId,
        roomTypeId,
        userId: data?.userId || null // 필요한 경우 userId도 함께 세팅
      });
    } else {
      navigate("/");
    }
  }, [location.state, accommodationId, roomTypeId, navigate, auth]);

  // 숙소 정보 불러오기
  useEffect(() => {
    const fetchAccommodation = async () => {
      if (bookingData?.accommodationId && bookingData?.roomTypeId) {
        const res = await AxiosClient("accommodations-rooms").get(
          `/acc/${bookingData.accommodationId}/roomType/${bookingData.roomTypeId}`
        );
        // console.log(res);
        const accroom = res.data[0];
        const INDEX = {
          NAME: 10,
          ADDRESS: 1,
          IMAGE_URL: 16,
          BASE_PRICE: 22,
          RTI_IMG: 23
        };
        setAccommodationData({
          name: accroom[INDEX.NAME] ?? "이름 없음",
          location: accroom[INDEX.ADDRESS] ?? "-",
          price: accroom[INDEX.BASE_PRICE] ?? 0,
          imageUrl: accroom[INDEX.IMAGE_URL] ?? ""
        });
      }
    };
    fetchAccommodation();
  }, [bookingData, accommodationId, roomTypeId]);

  // 예약 상세 정보 불러오기
  useEffect(() => {
    const fetchBookingInfo = async () => {
      if (bookingData?.userId) {
        const res = await AxiosClient("bookings").get(`/user/${auth.userId}`, {
          params: {
            accommodationId: bookingData.accommodationId,
            roomTypeId: bookingData.roomTypeId
          }
        });
        setBookingInfo(res.data[0]); // 목록 중 첫 번째 예약 사용
      }
    };
    fetchBookingInfo();
  }, [bookingData]);

  if (!bookingInfo || !accommodationData) {
    return <div className="no-data">❌ 예약 정보를 찾을 수 없습니다.</div>;
  }
  console.log(accommodationData)

  const user = bookingInfo.user || {}; // bookingInfo.user가 없으면 빈 객체
  const checkIn = bookingInfo.checkInDate;   // 실제 필드 이름에 맞춰서
  const checkOut = bookingInfo.checkOutDate;
  const paymentMethod = bookingInfo.paymentMethod;
  const bookedAt = bookingInfo.bookingDate;

  return (
    <div className="booking-confirmation">
      <h2>✅ 예약이 완료되었습니다!</h2>

      {/* 숙소 정보 */}
      <div className="accommodation-summary">
        <img
          src={accommodationData.imageUrl}
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
        <p><strong>예약자명:</strong> {user.username || "이름 미입력"}</p>
        <p><strong>전화번호:</strong> {user.phoneNumber || "전화번호 미입력"}</p>
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
