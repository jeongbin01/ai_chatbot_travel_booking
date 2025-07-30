// src/pages/BookingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosClient } from '../api/AxiosController';
import '../styles/pages/BookingPage.css'; // 스타일 파일 경로는 실제 위치에 맞게 조정하세요

const BookingPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    accommodationId: '',
    startDate: '',
    endDate: '',
    guests: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    try {
      const res = await AxiosClient('bookings').create({
        accommodationId: form.accommodationId,
        startDate: form.startDate,
        endDate: form.endDate,
        guests: form.guests,
      });
      // 백엔드 응답에 따라 id 필드명이 다를 수 있으니 콘솔 찍어서 확인하세요
      const bookingId = res.data.bookingId || res.data.id;
      // 결제 페이지로 이동하며 bookingId 상태 전달
      navigate(`/bookings/${bookingId}/payment`, { state: { bookingId } });
    } catch (err) {
      console.error('예약 생성 실패', err);
      alert('예약에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="booking-page">
      <h2>예약하기</h2>

      <div className="form-group">
        <label>숙소 ID</label>
        <input
          type="text"
          name="accommodationId"
          value={form.accommodationId}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>체크인</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>체크아웃</label>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>인원 수</label>
        <input
          type="number"
          name="guests"
          min="1"
          value={form.guests}
          onChange={handleChange}
        />
      </div>

      <button className="btn booking-button" onClick={handleBooking}>
        <i className="bi bi-calendar-check me-2"></i>
        예약하기
      </button>
    </div>
  );
};

export default BookingPage;
