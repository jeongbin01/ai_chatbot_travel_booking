// src/pages/accommodations/숙소/BookingPage.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../styles/pages/BookingPage.css";
import { AxiosClient } from "../../api/AxiosController";
import { AuthContext } from "../../context/AuthContext";
const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [accommodation, setAccommodation] = useState(
    // Detail 페이지에서 state로 넘겼다면 우선 사용
    location.state?.accommodation || null
  );
  const [loading, setLoading] = useState(!accommodation);
  const [error, setError] = useState("");

  // 폼 상태
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const { auth } = useContext(AuthContext);
  
  // ---- 숙소 불러오기: state → API → Mock 순서로 폴백 ----
  useEffect(() => {
    if (accommodation) return; // 이미 state로 받았으면 패스
    console.log(auth)
    if(!auth){
      navigate("/login")
    }
    setName(auth.nickname)
    setPhone(auth.phone)
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");

        const mydata = await AxiosClient("myuser").getById(auth.userId);
        // console.log(mydata)
        setPhone(mydata.data.phoneNumber)
        // 1) API 시도 (필요하다면 이미지/가격도 추가로 호출해서 채워도 됨)
        const accRes = await AxiosClient("accommodations").getById(id);
        const acc = accRes?.data ?? null;

        // 메인 이미지 폴백
        let mainImage = "/images/default-accommodation.jpg";
        try {
          const imgRes = await AxiosClient("accommodation-images").get("", {
            params: { accommodationId: id },
          });
          const imgs = Array.isArray(imgRes?.data) ? imgRes.data : [];
          const sorted = imgs
            .slice()
            .sort(
              (a, b) =>
                (a.orderNum ?? a.order_num ?? 0) -
                (b.orderNum ?? b.order_num ?? 0)
            );
          const first = sorted[0];
          mainImage =
            (first?.imageUrl ?? first?.url ?? mainImage)?.trim() ||
            mainImage;
        } catch {
          /* 이미지 실패 시 조용히 폴백 */
        }

        const normalized = acc
          ? {
              id: acc.accommodationId ?? acc.id ?? Number(id),
              name: acc.name ?? "",
              location: acc.address ?? "",
              price: acc.price ?? 0, // 백엔드에 단가가 없다면 0, 필요 시 정책에서 계산
              averageRating: acc.ratingAvg ?? 0,
              image: mainImage,
            }
          : null;

        if (!ignore) {
          if (normalized) {
            setAccommodation(normalized);
          } else {
            throw new Error("숙소 정보를 찾지 못했습니다.");
          }
        }
      } catch (e) {
        e?.message || "숙소를 불러오는 중 문제가 발생했습니다."
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [id, auth, navigate, accommodation]);

  // 전화번호 하이픈 자동 포맷
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 3 && value.length <= 7) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(
        7,
        11
      )}`;
    }
    setPhone(value);
  };

  // 숙박일수 + 총액 계산
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = Math.ceil(
      (outDate.setHours(0, 0, 0, 0) - inDate.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );
    return Math.max(0, diff);
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    const unit = Number(accommodation?.price || 0);
    return nights * unit;
  }, [nights, accommodation]);

  const todayStr = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  const handleBooking = () => {
    if (!name || !phone || !checkIn || !checkOut) {
      setError("모든 필수 정보를 입력해주세요.");
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      setError("체크아웃 날짜는 체크인 이후여야 합니다.");
      return;
    }
    const newBooking = {
      "accommodationId":id,
      "checkInDate": checkIn,
      "checkOutDate":checkOut,
      "totalAmount":50000,
      "userId":auth.userId,
    };
    console.log(newBooking)
    const stored = JSON.parse(localStorage.getItem("bookings")) || [];
    stored.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(stored));
    AxiosClient("bookings", auth.token).create(newBooking)
    navigate(`/booking/confirmation/${accommodation.id}`, {
      state: newBooking,
    });
  };

  if (loading) return <div className="booking-page">로딩 중…</div>;
  if (error)
    return <div className="booking-page">❌ {error}</div>;
  if (!accommodation)
    return <div className="booking-page">❌ 숙소를 찾을 수 없습니다.</div>;

  return (
    <div className="booking-page">
      {/* 숙소 정보 카드 */}
      <div className="accommodation-card">
        <img src={accommodation.image} alt={accommodation.name} />
        <div className="info">
          <h2>{accommodation.name}</h2>
          <p>📍 {accommodation.location}</p>
          <p>
            💰{" "}
            {Number(accommodation.price || 0).toLocaleString("ko-KR")}
            원 / 1박
          </p>
          <p>⭐ {accommodation.averageRating}</p>
        </div>
      </div>

      {/* 예약자 정보 입력 */}
      <div className="form-section">
        <h3>예약자 정보 입력</h3>
        <input
          type="text"
          placeholder="예약자 이름"
          value={name}
          readOnly
        />
        <input
          type="tel"
          placeholder="전화번호 (숫자만 입력)"
          value={phone}
          onChange={handlePhoneChange}
        />

        <label>체크인 날짜</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => {
            setCheckIn(e.target.value);
            // 체크인 변경 시 체크아웃이 이전이면 비워줌
            if (checkOut && new Date(e.target.value) >= new Date(checkOut)) {
              setCheckOut("");
            }
          }}
          min={todayStr}
        />

        <label>체크아웃 날짜</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={checkIn || todayStr}
        />

        {nights > 0 && (
          <div className="price-summary">
            <div>숙박 일수: <strong>{nights}</strong>박</div>
            <div>
              총 금액:{" "}
              <strong>
                {Number(totalPrice).toLocaleString("ko-KR")}원
              </strong>
            </div>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>

      {/* 예약 완료 버튼 */}
      <div className="bottom-actions">
        <button onClick={handleBooking} className="booking-confirm-btn">
          예약 완료
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
