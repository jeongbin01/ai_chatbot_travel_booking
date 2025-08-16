import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosClient } from "../../api/AxiosController";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/pages/BookingPage.css";

const BookingPage = () => {
  const { id } = useParams(); // accommodationId
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const { auth } = useContext(AuthContext);

  // 로그인 상태 & 기본 정보
  useEffect(() => {
    if (!auth) {
      navigate("/login");
      return;
    }
    setName(auth?.nickname || auth?.username || "");

    (async () => {
      try {
        let mydata;
        if (auth?.oauthSelect == "1") {
          mydata = await AxiosClient("mypage", auth.token).getById(auth.userId);
        } else if (auth?.oauthSelect == "0") {
          mydata = await AxiosClient("myuser", auth.token).getById(auth.userId);
        }
        // console.log(auth, mydata);
        setPhone(mydata.data.phoneNumber);
      } catch (e) {
        console.warn("프로필 불러오기 실패:", e?.message ?? e);
      }
    })();
  }, [auth, navigate]);

  // 방 타입 불러오기
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await AxiosClient("accommodations-rooms").getById(id)
        const INDEX = {
          ROOM_TYPE_ID: 17,
          BED_TYPE: 18,
          ROOM_DESCRIPTION: 19,
          MAX_OCCUPANCY: 20,
          ROOM_NAME: 21,
          BASE_PRICE: 22
        };
        const rooms = res.data.map(accroom => ({
          roomTypeId: accroom[INDEX.ROOM_TYPE_ID] ?? null,
          roomName: accroom[INDEX.ROOM_NAME] ?? "",
          bedType: accroom[INDEX.BED_TYPE] ?? "",
          description: accroom[INDEX.ROOM_DESCRIPTION] ?? "",
          maxOccupancy: accroom[INDEX.MAX_OCCUPANCY] ?? 1,
          basePrice: accroom[INDEX.BASE_PRICE] ?? 0,
        }));
        setRoomTypes(rooms);
        setSelectedRoomType(rooms.length > 0 ? String(rooms.roomName) : "");
      } catch (err) {
        console.error("방 타입 불러오기 실패", err);
      }
    })();
  }, [id]);

  // 전화번호 하이픈 처리
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 3 && value.length <= 7) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setPhone(value);
  };

  // 숙박일 계산
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
    // console.log(selectedRoomType)
    const selectedRoom = roomTypes.find(r => r.roomTypeId == selectedRoomType);
    const unit = Number(selectedRoom?.basePrice ?? 0);
    // console.log(unit, selectedRoom, roomTypes)
    return nights * unit;
  }, [nights, selectedRoomType]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const handleBooking = async () => {
    if (!name || !phone || !checkIn || !checkOut || !selectedRoomType) {
      setError("모든 필수 정보를 입력해주세요.");
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      setError("체크아웃 날짜는 체크인 이후여야 합니다.");
      return;
    }
    try {
      const newBooking = {
        booking_data:(new Date().toISOString()),
        accommodationId: id,
        roomTypeId: selectedRoomType || "",
        checkInDate: checkIn,
        checkOutDate: checkOut,
        userId: auth.userId,
        totalAmount: Number(totalPrice) || 0,
      };
      console.log(newBooking)
      await AxiosClient("bookings", auth.token).create(newBooking);
      navigate(`/booking/confirmation/${newBooking.accommodationId}/${newBooking.roomTypeId}`, { state: newBooking });
    } catch (e) {
      setError(
        e?.response?.data?.message || e?.message || "예약 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="booking-page">
      <div className="form-section">
        <h3>예약자 정보 입력</h3>

        <input type="text" value={name} readOnly />
        <input
          type="tel"
          placeholder="전화번호"
          value={phone}
          onChange={handlePhoneChange}
        />

        <label>체크인 날짜</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => {
            setCheckIn(e.target.value);
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

        <label>방 타입 선택</label>
        <select
          value={selectedRoomType}
          onChange={(e) => setSelectedRoomType(e.target.value)}
          disabled={roomTypes.length === 0}
        >
          <option value="">선택하세요.</option>
          {roomTypes.length === 0 && (
            <option value="">선택 가능한 방 타입이 없습니다</option>
          )}
          {roomTypes.map((rt) => {
            const idVal = String(rt.roomTypeId ?? rt.id);
            const nameVal = rt.name ?? rt.roomName ?? "이름 없음";
            return (
              <option key={idVal} value={idVal}>
                {nameVal}
              </option>
            );
          })}
        </select>

        {nights > 0 && (
          <>
            <div className="price-summary">숙박 일수: <strong>{nights}</strong>박</div>
            <div>
                총 금액:{" "}
                <strong>
                  {Number(totalPrice).toLocaleString("ko-KR")}원
                </strong>
            </div>
          </>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="bottom-actions">
        <button
          onClick={handleBooking}
          className="booking-confirm-btn"
          disabled={!selectedRoomType}
        >
          예약 완료
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
