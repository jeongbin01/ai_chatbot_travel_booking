import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/utils/Reservations.css";
import "../../styles/utils/MyPageLayout.css"; // 기존 스타일 파일 추가

const Reservations = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("국내숙소");
  const [reservationList, setReservationList] = useState([]);

  const sampleData = {
    국내숙소: [
      { id: 1, title: "제주 바다 펜션", date: "2025-08-10 ~ 2025-08-12" },
      { id: 2, title: "부산 오션뷰 호텔", date: "2025-09-01 ~ 2025-09-02" },
    ],
    해외숙소: [],
    "패키지 여행": [],
  };

  useEffect(() => {
    setReservationList(sampleData[activeTab] || []);
  }, [activeTab]);

  const handleFindTrips = () => {
    window.location.href = "/accommodations";
  };

  return (
    <div className="page-wrapper">
      {/* 사이드바 */}
      <aside className="sidebar">
        <ul>
          <li className={location.pathname === "/mypage/bookings" ? "active" : ""}>
            <Link to="/mypage/bookings">예약 내역</Link>
          </li>
          <li className={location.pathname === "/mypage/wishlist" ? "active" : ""}>
            <Link to="/mypage/wishlist">찜 목록</Link>
          </li>
          <li className={location.pathname === "/mypage/profile" ? "active" : ""}>
            <Link to="/mypage/profile">내 정보 관리</Link>
          </li>
        </ul>
      </aside>

      {/* 콘텐츠 */}
      <section className="page-content">
        <h2>예약 내역</h2>

        {/* 탭 */}
        <div className="reservation-tabs">
          {["국내숙소", "해외숙소", "패키지 여행"].map((tab) => (
            <button
              key={tab}
              className={tab === activeTab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 예약 목록 */}
        {reservationList.length === 0 ? (
          <div className="empty-box">
            <p className="empty-title">예정된 여행이 없습니다.</p>
            <p className="empty-sub">지금 새로운 예약을 진행해보세요.</p>
            <button className="find-button" onClick={handleFindTrips}>
              여행지 찾아보기
            </button>
          </div>
        ) : (
          <div className="reservation-list">
            {reservationList.map((item) => (
              <div key={item.id} className="reservation-card">
                <h4>{item.title}</h4>
                <p>{item.date}</p>
              </div>
            ))}
          </div>
        )}

        {/* 완료/취소 내역 */}
        <div className="history-section">
          <h3>이용완료 및 예약취소</h3>
          <p className="empty-sub">해당되는 예약 내역이 없습니다.</p>
        </div>
      </section>
    </div>
  );
};

export default Reservations;