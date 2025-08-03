// src/components/BookingDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchBookingById,
  deleteBooking,
  updateBooking,
} from "../../api/bookingAPI";
import { fetchPrimaryContactByBookingId } from "../../api/bookingGuestApi";
import "../../styles/pages/BookingDetail.css";


export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);

  // 예약 + 게스트 정보 로드
  useEffect(() => {
    if (!id) return;

    const loadDetail = async () => {
      try {
        const bookingData = await fetchBookingById(id);
        setBooking(bookingData);

        const guestData = await fetchPrimaryContactByBookingId(id);
        setGuest(guestData);
      } catch (err) {
        console.error("❌ 예약 정보 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  // 예약 취소 버튼 핸들러
  const handleCancel = async () => {
    try {
      await updateBooking(id, {
        ...booking,
        status: "취소",
      });
      alert("✅ 예약이 취소되었습니다.");
      navigate("/bookings");
    } catch (err) {
      alert("❌ 예약 취소 실패: " + err.message);
    }
  };

  // 삭제 버튼 핸들러
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteBooking(id);
      alert("✅ 예약이 삭제되었습니다.");
      navigate("/bookings");
    } catch (err) {
      alert("❌ 삭제 실패: " + err.message);
    }
  };

  // 수정 페이지 이동
  const handleEdit = () => {
    navigate(`/bookings/edit/${id}`);
  };

  // 로딩 or 에러 처리
  if (loading) return <div>🔄 로딩 중...</div>;
  if (!booking) return <div>❗ 예약 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="booking-detail">
      <h2>예약 상세</h2>

      {/* 숙소 정보 */}
      <section className="booking-box">
        <h3 className="section-title">숙소 정보</h3>
        <div className="info-row">
          <span>체크인</span>
          <span> 15:00</span>
        </div>
        <div className="info-row">
          <span>체크아웃</span>
          <span> 11:00</span>
        </div>
        <div className="info-row">
          <span>성인</span>
          <span>{booking.num_adults}명</span>
        </div>
        <div className="info-row">
          <span>예약 상태</span>
          <span>{booking.status}</span>
        </div>
      </section>

      {/* 대표 게스트 정보 */}
      {guest && (
        <section className="booking-box">
          <h3 className="section-title">대표 게스트 정보</h3>
          <div className="info-row">
            <span>이름</span>
            <span>{guest.name}</span>
          </div>
          <div className="info-row">
            <span>연락처</span>
            <span>{guest.phone}</span>
          </div>
        </section>
      )}

      {/* 결제 정보 */}
      <section className="booking-box">
        <h3 className="section-title">결제 정보</h3>
        <div className="info-row total">
          <span>총 결제 금액</span>
          <span>{booking.total_amount?.toLocaleString()}원</span>
        </div>
      </section>

      {/* 버튼들 */}
      <section className="button-group">
        <button className="btn btn-secondary" onClick={handleEdit}>
          ✏️ 수정
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          🗑 삭제
        </button>
        {booking.status !== "취소" && (
          <button className="btn btn-outline-warning" onClick={handleCancel}>
            🚫 예약 취소
          </button>
        )}
      </section>
    </div>
  );
}
