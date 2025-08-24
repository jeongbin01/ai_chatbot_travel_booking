// src/pages/booking/BookingPage.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosClient } from "../../api/AxiosController";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/pages/BookingPage.css";

/** === 스위치 ===
 * 백엔드 결제 API 연동 시 true로 바꾸고 createRealPayment()를 실제 스펙에 맞추세요.
 */
const USE_REAL_PAYMENT_API = false;

// 공통 카드사/은행 목록
const BANKS = ["국민", "신한", "우리", "하나", "삼성", "현대", "BC", "NH", "롯데", "우체국"];

const BookingPage = () => {
  const { id } = useParams(); // accommodationId
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [roomsLoading, setRoomsLoading] = useState(false);

  // ====== 결제 입력값 ======
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // card | bank | vbank | kakao

  // 카드
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");   // MM/YY
  const [cardBirth, setCardBirth] = useState("");     // YY.MM.DD (표시는 점 포함, 검증은 숫자 6)
  const [cardCvc, setCardCvc] = useState("");         // 3자리
  const [cardIssuer, setCardIssuer] = useState("");

  // 계좌이체/가상계좌 공통
  const [bankName, setBankName] = useState("");
  const [depositorName, setDepositorName] = useState(""); // 입금자명 (vbank에서 특히 중요)

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로그인 & 기본 정보
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
        setPhone(mydata?.data?.phoneNumber || "");
      } catch (e) {
        console.warn("프로필 불러오기 실패:", e?.message ?? e);
      }
    })();
  }, [auth, navigate]);

  // 방 타입 불러오기 (배열-인덱스형/키-기반 모두 방어)
  useEffect(() => {
    if (!id) return;
    setRoomsLoading(true);
    (async () => {
      try {
        const res = await AxiosClient("accommodations-rooms", auth?.token).getById(id);
        const data = res?.data || [];

        const INDEX = {
          ROOM_TYPE_ID: 17,
          BED_TYPE: 18,
          ROOM_DESCRIPTION: 19,
          MAX_OCCUPANCY: 20,
          ROOM_NAME: 21,
          BASE_PRICE: 22,
        };

        const rooms = Array.isArray(data)
          ? data.map((row) => {
              const isArray = Array.isArray(row);
              const get = (k, fallback) =>
                (isArray ? row?.[INDEX[k]] : row?.[k]) ?? fallback;

              return {
                roomTypeId: get("ROOM_TYPE_ID", null),
                roomName: get("ROOM_NAME", ""),
                bedType: get("BED_TYPE", ""),
                description: get("ROOM_DESCRIPTION", ""),
                maxOccupancy: Number(get("MAX_OCCUPANCY", 1)) || 1,
                basePrice: Number(get("BASE_PRICE", 0)) || 0,
              };
            })
          : [];

        const validRooms = rooms.filter((r) => r.roomTypeId != null);
        setRoomTypes(validRooms);
        setSelectedRoomType(validRooms.length ? String(validRooms[0].roomTypeId) : "");
      } catch (err) {
        console.error("방 타입 불러오기 실패", err);
        setRoomTypes([]);
        setSelectedRoomType("");
      } finally {
        setRoomsLoading(false);
      }
    })();
  }, [id, auth?.token]);

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

  // 카드 포매팅
  const onChangeCardNumber = (e) => {
    const digits = e.target.value.replace(/[^\d]/g, "").slice(0, 19);
    const groups = digits.match(/.{1,4}/g) || [];
    setCardNumber(groups.join("-"));
  };
  const onChangeCardExpiry = (e) => {
    let v = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
    if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    setCardExpiry(v);
  };
  const onChangeCardBirth = (e) => {
    let v = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    if (v.length >= 5) v = `${v.slice(0, 2)}.${v.slice(2, 4)}.${v.slice(4, 6)}`;
    else if (v.length >= 3) v = `${v.slice(0, 2)}.${v.slice(2, 4)}`;
    setCardBirth(v);
  };

  // 간단 유효성
  const isValidPhone = (p) => /^01[016789]-\d{3,4}-\d{4}$/.test(p);
  const isValidExpiry = (mmYY) => {
    if (!/^\d{2}\/\d{2}$/.test(mmYY)) return false;
    const mm = parseInt(mmYY.slice(0, 2), 10);
    if (mm < 1 || mm > 12) return false;
    const yy = parseInt(mmYY.slice(3, 5), 10);
    const exp = new Date(2000 + yy, mm, 1); // 다음달 1일
    return exp > new Date();
  };

  const validatePaymentFields = () => {
    if (!agreeTerms) return "약관 동의가 필요합니다.";
    if (!isValidPhone(phone)) return "전화번호 형식을 확인해주세요. 예) 010-1234-5678";

    if (paymentMethod === "card") {
      if (!cardIssuer) return "카드사를 선택해주세요.";
      const num = cardNumber.replace(/\s|-/g, "");
      if (!(num.length === 15 || num.length === 16 || num.length === 19)) {
        return "카드번호(15/16/19자리)를 확인해주세요.";
      }
      if (!isValidExpiry(cardExpiry)) return "유효기간(MM/YY)을 확인해주세요.";
      if (cardBirth.replace(/\D/g, "").length !== 6) return "생년월일(YY.MM.DD) 6자리를 입력해주세요.";
      if (cardCvc.replace(/\D/g, "").length < 3) return "CVC(카드 뒷면 3~4자리)를 입력해주세요.";
    }

    if (paymentMethod === "bank") {
      if (!bankName) return "이체할 은행을 선택해주세요.";
      if (!depositorName.trim()) return "입금자명을 입력해주세요.";
    }

    if (paymentMethod === "vbank") {
      if (!bankName) return "가상계좌 발급 은행을 선택해주세요.";
      if (!depositorName.trim()) return "입금자명을 입력해주세요.";
    }

    return null;
  };

  // 숙박일/금액 계산
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil(
      (new Date(end.getFullYear(), end.getMonth(), end.getDate()) -
        new Date(start.getFullYear(), start.getMonth(), start.getDate())) /
        (1000 * 60 * 60 * 24)
    );
    return Math.max(0, diff);
  }, [checkIn, checkOut]);

  const selectedRoom = useMemo(
    () => roomTypes.find((r) => String(r.roomTypeId) === String(selectedRoomType)),
    [roomTypes, selectedRoomType]
  );

  const totalPrice = useMemo(() => {
    const unit = Number(selectedRoom?.basePrice ?? 0) || 0;
    return nights * unit;
  }, [nights, selectedRoom]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const nextDay = (d) => {
    if (!d) return todayStr;
    const t = new Date(d);
    t.setDate(t.getDate() + 1);
    return t.toISOString().split("T")[0];
  };

  /** =========================
   *   결제(모의) / 결제(실제)
   * ========================= */
  const fakeWait = (ms) => new Promise((res) => setTimeout(res, ms));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const genId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // 프런트-only 모의 결제
  const createFakePayment = async ({ method, amount, roomName, payerName }) => {
    await fakeWait(500);

    if (method === "card") {
      return {
        paymentId: genId("pay"),
        status: "PAID",
        method,
        amount,
        approvedAt: new Date().toISOString(),
        cardLast4: cardNumber.replace(/-/g, "").slice(-4),
        cardExpiry,
        cardIssuer,
        payerName,
      };
    }

    if (method === "bank") {
      return {
        paymentId: genId("pay"),
        status: "PAID",
        method,
        amount,
        approvedAt: new Date().toISOString(),
        bankName,
        depositorName,
        payerName,
      };
    }

    if (method === "vbank") {
      const selected = bankName || BANKS[rand(0, BANKS.length - 1)];
      const accountNo = `${rand(10, 99)}-${rand(1000, 9999)}-${rand(100000, 999999)}`;
      const expireAt = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(); // 3일 뒤
      return {
        paymentId: genId("pay"),
        status: "PENDING",
        method,
        amount,
        vbank: { bank: selected, accountNo, holder: depositorName || payerName, expireAt },
      };
    }

    if (method === "kakao") {
      return {
        paymentId: genId("pay"),
        status: "PAID",
        method,
        amount,
        approvedAt: new Date().toISOString(),
        provider: "KAKAOPAY",
        itemName: roomName || "숙박상품",
        payerName,
      };
    }

    throw new Error("지원하지 않는 결제수단");
  };

  // 실제 결제 API 사용(원하면 이 부분을 BE 스펙에 맞게 바꿔주세요)
  const createRealPayment = async ({ method, amount, roomName, payerName }) => {
    // 실제 연동 시 민감정보 저장 금지(전송만):
    // const resp = await AxiosClient("payments", auth.token).create({...});
    // return resp.data;

    return createFakePayment({ method, amount, roomName, payerName });
  };

  /** =========================
   *   예약 + 결제 처리
   * ========================= */
  const handleBooking = async () => {
    if (isSubmitting) return;
    setError("");

    if (!name || !phone || !checkIn || !checkOut || !selectedRoomType) {
      setError("모든 필수 정보를 입력해주세요.");
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      setError("체크아웃 날짜는 체크인 이후여야 합니다.");
      return;
    }
    if ((selectedRoom?.basePrice ?? 0) <= 0 || nights <= 0) {
      setError("유효한 방/금액/숙박일수를 확인해주세요.");
      return;
    }

    const payErr = validatePaymentFields();
    if (payErr) {
      setError(payErr);
      return;
    }

    try {
      setIsSubmitting(true);

      // 1) 결제 먼저 시도
      const payment = USE_REAL_PAYMENT_API
        ? await createRealPayment({
            method: paymentMethod,
            amount: Number(totalPrice),
            roomName: selectedRoom?.roomName,
            payerName: name,
          })
        : await createFakePayment({
            method: paymentMethod,
            amount: Number(totalPrice),
            roomName: selectedRoom?.roomName,
            payerName: name,
          });

      // 2) 예약 생성 (결제 결과 반영)
      const bookingPayload = {
        bookingDate: new Date().toISOString(),
        accommodationId: Number(id),
        roomTypeId: Number(selectedRoomType),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        userId: auth.userId,
        totalAmount: Number(totalPrice) || 0,
        paymentMethod,
        paymentStatus: payment.status,   // card/bank/kakao: PAID, vbank: PENDING
        paymentId: payment.paymentId,    // vbank도 발급 시 id가 있음
        // 표시용(옵션)
        cardIssuer: paymentMethod === "card" ? cardIssuer : undefined,
        bankName:
          paymentMethod === "bank"
            ? bankName
            : (paymentMethod === "vbank" ? payment?.vbank?.bank : undefined),
        depositorName:
          (paymentMethod === "bank" || paymentMethod === "vbank")
            ? (depositorName || name)
            : undefined,
      };

      const createRes = await AxiosClient("bookings", auth.token).create(bookingPayload);
      const created = createRes?.data || {};
      const bookingId = created.bookingId ?? created.id ?? created.booking_id;
      if (!bookingId) throw new Error("예약 ID를 확인할 수 없습니다.");

      const persistedBooking = { ...bookingPayload, bookingId };

      // 3) 결제 요약 구성 + 세션 저장
      const paymentSummary = {
        bookingId,
        method: paymentMethod,
        status: payment.status,
        approvedAt: paymentMethod === "vbank" ? undefined : (payment.approvedAt || new Date().toISOString()),
        card:
          paymentMethod === "card"
            ? {
                issuer: cardIssuer,
                last4: cardNumber.replace(/\D/g, "").slice(-4),
                exp: cardExpiry,
              }
            : undefined,
        bank:
          paymentMethod === "bank"
            ? {
                name: bankName,
                depositorName: depositorName || name,
              }
            : undefined,
        vbank:
          paymentMethod === "vbank"
            ? payment.vbank /* { bank, accountNo, holder, expireAt } */
            : undefined,
      };

      sessionStorage.setItem("lastPayment", JSON.stringify(paymentSummary));
      const result = { bookingId, booking: persistedBooking, payment: paymentSummary };
      sessionStorage.setItem("lastBookingResult", JSON.stringify(result));

      // 4) 확인 페이지 이동
      navigate(`/booking/confirmation/${id}/${selectedRoomType}?bid=${bookingId}`, {
        state: { ...persistedBooking, bookingId, payment: paymentSummary },
      });
    } catch (e) {
      const serverMsg = e?.response?.data?.message || e?.message;
      setError(serverMsg ? `처리 중 오류: ${serverMsg}` : "예약/결제 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
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
          min={nextDay(checkIn)}
        />

        <label>방 타입 선택</label>
        <select
          value={selectedRoomType}
          onChange={(e) => setSelectedRoomType(e.target.value)}
          disabled={roomsLoading || roomTypes.length === 0}
        >
          <option value="">선택하세요.</option>
          {roomsLoading && <option value="">불러오는 중...</option>}
          {!roomsLoading && roomTypes.length === 0 && (
            <option value="">선택 가능한 방 타입이 없습니다</option>
          )}
          {!roomsLoading &&
            roomTypes.map((rt) => {
              const idVal = String(rt.roomTypeId ?? rt.id);
              const nameVal = rt.roomName ?? rt.name ?? "이름 없음";
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
            <div className="price-summary">
              1박 가격: <strong>{(Number(selectedRoom?.basePrice ?? 0) || 0).toLocaleString("ko-KR")}원</strong>
            </div>
            <div className="price-summary">
              총 금액: <strong>{Number(totalPrice).toLocaleString("ko-KR")}원</strong>
            </div>
          </>
        )}

        {/* === 결제 섹션 === */}
        <hr className="divider" />
        <h3>결제 수단</h3>

        <div className="payment-methods">
          <label className={`pm-item ${paymentMethod === "card" ? "is-active" : ""}`}>
            <input
              type="radio"
              name="paymethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => { setPaymentMethod(e.target.value); setBankName(""); setDepositorName(""); }}
            />
            카드결제
          </label>
          <label className={`pm-item ${paymentMethod === "bank" ? "is-active" : ""}`}>
            <input
              type="radio"
              name="paymethod"
              value="bank"
              checked={paymentMethod === "bank"}
              onChange={(e) => { setPaymentMethod(e.target.value); setCardIssuer(""); }}
            />
            계좌이체
          </label>
          <label className={`pm-item ${paymentMethod === "vbank" ? "is-active" : ""}`}>
            <input
              type="radio"
              name="paymethod"
              value="vbank"
              checked={paymentMethod === "vbank"}
              onChange={(e) => { setPaymentMethod(e.target.value); setCardIssuer(""); }}
            />
            가상계좌(무통장)
          </label>
          <label className={`pm-item ${paymentMethod === "kakao" ? "is-active" : ""}`}>
            <input
              type="radio"
              name="paymethod"
              value="kakao"
              checked={paymentMethod === "kakao"}
              onChange={(e) => { setPaymentMethod(e.target.value); setCardIssuer(""); setBankName(""); setDepositorName(""); }}
            />
            카카오페이
          </label>
        </div>

        {/* 카드 입력 (순서: 카드사 → 카드번호 → 유효기간 → CVC → 생년월일) */}
        {paymentMethod === "card" && (
          <>
            {/* 1) 카드사 */}
            <label htmlFor="cardIssuer">카드사 선택</label>
            <select id="cardIssuer" value={cardIssuer} onChange={(e) => setCardIssuer(e.target.value)}>
              <option value="">선택하세요.</option>
              {BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <div className="card-fields">
              {/* 2) 카드번호 */}
              <label htmlFor="cardNumber">카드번호</label>
              <input
                id="cardNumber"
                type="text"
                inputMode="numeric"
                placeholder="1234-5678-9012-3456"
                value={cardNumber}
                onChange={onChangeCardNumber}
                maxLength={23}
              />

              <div className="card-row">
                {/* 3) 유효기간 */}
                <div className="card-col">
                  <label htmlFor="cardExpiry">유효기간 (MM/YY)</label>
                  <input
                    id="cardExpiry"
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={onChangeCardExpiry}
                    maxLength={5}
                  />
                </div>

                {/* 4) CVC */}
                <div className="card-col">
                  <label htmlFor="cardCvc">CVC</label>
                  <input
                    id="cardCvc"
                    type="text"
                    inputMode="numeric"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    maxLength={3}
                  />
                </div>

                {/* 5) 생년월일 */}
                <div className="card-col">
                  <label htmlFor="cardBirth">생년월일 (YY.MM.DD)</label>
                  <input
                    id="cardBirth"
                    type="text"
                    inputMode="numeric"
                    placeholder="예: 99.01.01"
                    value={cardBirth}
                    onChange={onChangeCardBirth}
                    maxLength={8}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* 계좌이체 / 가상계좌 입력 */}
        {(paymentMethod === "bank" || paymentMethod === "vbank") && (
          <>
            <label htmlFor="bankName">은행 선택</label>
            <select id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)}>
              <option value="">선택하세요.</option>
              {BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <label htmlFor="depositorName">입금자명</label>
            <input
              id="depositorName"
              type="text"
              placeholder="예: 홍길동"
              value={depositorName}
              onChange={(e) => setDepositorName(e.target.value)}
              maxLength={20}
            />
          </>
        )}

        <label className="agree-terms">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          (필수) 예약 및 결제 약관에 동의합니다.
        </label>
        <button
          onClick={handleBooking}
          className="booking-confirm-btn"
          disabled={!selectedRoomType || !agreeTerms || isSubmitting}
        >
          {isSubmitting ? "처리 중..." : "예약 + 결제 완료"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default BookingPage;
