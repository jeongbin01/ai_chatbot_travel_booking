import React, { useState, useEffect } from "react";
import "../../styles/components/TimeSaleSection.css";

import jeju from "../../assets/images/국내 지역/제주도.jpg";
import busan from "../../assets/images/국내 지역/부산.jpg";

const sampleDeals = [
  {
    id: 1,
    title: "제주도 여름 특가",
    image: jeju,
    originalPrice: 200000,
    discountedPrice: 150000,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    stockLeft: 10,
  },
  {
    id: 2,
    title: "부산 해운대 특가",
    image: busan,
    originalPrice: 180000,
    discountedPrice: 130000,
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    stockLeft: 5,
  },
];

export default function TimeSaleSection({ deals = sampleDeals }) {
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() =>
    calcRemaining(deals[0].endTime)
  );

  useEffect(() => {
    const update = () => {
      const remaining = calcRemaining(deals[current].endTime);
      if (remaining.total <= 0) {
        clearInterval(timer);
        setTimeLeft({ ...remaining, expired: true });
      } else {
        setTimeLeft(remaining);
      }
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [current, deals]);

  const next = () => setCurrent((c) => (c + 1) % deals.length);
  const prev = () => setCurrent((c) => (c - 1 + deals.length) % deals.length);

  const deal = deals[current];
  const expired = timeLeft.total <= 0;

  return (
    <section className="time-deal">
      {/* 타이틀 */}
      <div className="time-deal__title-wrapper">
        <h2 className="time-deal__title">
          <i className="bi bi-stopwatch-fill me-2"></i>
          오늘의 타임세일
        </h2>
        <p className="time-deal__subtitle">
          <i className="bi bi-lightning-charge-fill me-1 text-warning"></i>
          단 하루! 지금 예약하면 최대 50% 할인
        </p>
      </div>

      {/* 타이머 헤더 */}
      <header className="time-deal__header">
        <span className={`time-deal__badge ${expired ? "expired" : ""}`}>
          <i
            className={`bi ${
              expired ? "bi-x-circle-fill text-muted" : "bi-clock-fill"
            }`}
          ></i>{" "}
          {expired ? "마감" : `D-${timeLeft.days}`}
        </span>
        <div className="time-deal__timer">
          <i className="bi bi-hourglass-split me-1"></i>
          {expired
            ? "00:00:00"
            : `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(
                timeLeft.seconds
              )}`}
        </div>
      </header>

      {/* 메인 카드 슬라이드 */}
      <div className="time-deal__main">
        <button
          className="nav prev"
          onClick={prev}
          aria-label="이전 딜"
          disabled={deals.length < 2}
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        <div className="deal-card__wrapper">
          <div className="deal-card active">
            <img src={deal.image} alt={deal.title} />

            {deal.badge && (
              <span className="deal-card__badge">
                <i className="bi bi-fire me-1"></i> {deal.badge}
              </span>
            )}

            <div className="deal-card__info">
              <span className="deal-card__title">
                <i className="bi bi-tag-fill me-2 text-danger"></i>
                {deal.title}
              </span>

              <span className="deal-card__price">
                <em className="text-danger">
                  <i className="bi bi-currency-won"></i>{" "}
                  {deal.discountedPrice.toLocaleString()}원
                </em>
                <small>
                  <del className="text-muted">
                    <i className="bi bi-currency-won"></i>{" "}
                    {deal.originalPrice.toLocaleString()}원
                  </del>
                </small>
              </span>
            </div>
          </div>
        </div>

        <button
          className="nav next"
          onClick={next}
          aria-label="다음 딜"
          disabled={deals.length < 2}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}

// 남은 시간 계산 유틸
function calcRemaining(endTime) {
  const total = Date.parse(endTime) - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

// 2자리 패딩
function pad(n) {
  return n.toString().padStart(2, "0");
}
