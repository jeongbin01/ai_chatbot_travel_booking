import React, { useEffect, useState, useContext } from "react";
import "../../styles/utils/Reservations.css";
import "../../styles/utils/MyPageLayout.css"; // 기존 스타일 파일 추가
import MyPageAside from "./MyPageAside"; 
import { AxiosClient } from "../../api/AxiosController.jsx";
import { AuthContext } from "../../context/AuthContext";
const Reservations = () => {
  const { auth } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("국내숙소");
  const [reservationList, setReservationList] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!auth) {
        alert("로그인 해주세요.");
        navigate("/login");
        return;
      }

      try {
        const response = await AxiosClient("bookings").get(`/user/${auth.userId}`);
        console.log(response.data);
        const domestic_booking = response.data
          .filter(booking => booking.accommodation.isDomestic === 'Y');
        const foregin_booking = response.data
          .filter(booking => booking.accommodation.isDomestic === 'N');
        const bookingData = {
          "국내숙소":domestic_booking,
          "해외숙소":foregin_booking,
          "패키지 여행":[],
        }
        setReservationList(bookingData || []);
      } catch (error) {
        console.error("예약 불러오기 실패:", error);
      }
    };

    fetchReservations();
  }, [auth, activeTab]);

  const handleFindTrips = () => {
    window.location.href = "/accommodations";
  };

  return (
    <div className="page-wrapper">
      {/* 사이드바 */}
      <MyPageAside/>

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
        {(reservationList[activeTab] && reservationList[activeTab].length > 0) ? (
          <div className="reservation-list">
            {reservationList[activeTab].map((item) => (
              <div 
                key={item.bookingId || item.id || `${activeTab}-${index}`} 
                className="reservation-card"
              >
                <h4>{item.accommodation?.name || item.title}</h4>
                <p>{item.checkInDate} ~ {item.checkOutDate}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-box">
            <p className="empty-title">예정된 여행이 없습니다.</p>
            <p className="empty-sub">지금 새로운 예약을 진행해보세요.</p>
            <button className="find-button" onClick={handleFindTrips}>
              여행지 찾아보기
            </button>
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