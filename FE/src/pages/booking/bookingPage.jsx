import React, { useState } from "react";
import "../../styles/pages/BookingPage.css";

export default function BookingCard({
  roomName = "로마 부티크 호텔",
  checkIn = "2025.08.10",
  checkOut = "2025.08.12",
  basePrice = 120000,
}) {
  const [phone, setPhone] = useState("");
  const [coupon, setCoupon] = useState(null);

  const finalPrice = coupon ? basePrice - coupon.discount : basePrice;

  const handlePay = () => {
    if (!phone) {
      alert("예약자 연락처를 입력해 주세요.");
      return;
    }
    alert(`결제 진행: ${finalPrice.toLocaleString()}원`);
  };

  return (
    <div className="booking-card">
      <h2 className="card-title">{roomName}</h2>

      <div className="booking-info">
        <div className="booking-row">
          <span className="label">체크인</span>
          <span className="value">{checkIn}</span>
        </div>
        <div className="booking-row">
          <span className="label">체크아웃</span>
          <span className="value">{checkOut}</span>
        </div>
        <div className="booking-row">
          <span className="label">연락처</span>
          <input
            className="input"
            type="tel"
            placeholder="010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="booking-row">
          <span className="label">쿠폰</span>
          <select
            className="select"
            onChange={(e) => {
              const value = e.target.value;
              setCoupon(value ? JSON.parse(value) : null);
            }}
          >
            <option value="">사용 안함</option>
            <option value={JSON.stringify({ name: "여름 할인", discount: 20000 })}>
              여름 할인 -2만원
            </option>
            <option value={JSON.stringify({ name: "신규회원", discount: 10000 })}>
              신규회원 -1만원
            </option>
          </select>
        </div>
      </div>

      <div className="booking-total">
        <span>총 결제 금액</span>
        <strong>{finalPrice.toLocaleString()}원</strong>
      </div>

      <button className="pay-button" onClick={handlePay}>
        {finalPrice.toLocaleString()}원 결제하기
      </button>
    </div>
  );
}
