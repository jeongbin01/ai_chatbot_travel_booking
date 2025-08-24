import React from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { AxiosClient } from "../../api/AxiosController";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/pages/BookingConfirmation.css";

/* 결제 수단 라벨 */
const METHOD_LABEL = {
  card: "카드결제",
  bank: "계좌이체",
  transfer: "계좌이체", // 일부 PG는 transfer로 내려옴
  vbank: "가상계좌",
  kakao: "카카오페이",
  naver: "네이버페이",
  toss: "토스페이",
};
const PLACEHOLDER = "—";
const pad2 = (n) => String(n).padStart(2, "0");

const formatKRDate = (isoLike) => {
  if (!isoLike) return PLACEHOLDER;
  const d = new Date(isoLike);
  if (isNaN(d.getTime())) return PLACEHOLDER;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};
const fmtWon = (n) =>
  n == null ? PLACEHOLDER : `${Number(n).toLocaleString("ko-KR")}원`;
const tryParse = (s) => { try { return JSON.parse(s); } catch { return null; } };

/* ===== 서버 호출 유틸 ===== */
async function fetchPaymentByBookingId(bookingId) {
  try {
    const res = await AxiosClient.get(`/payment/booking/${bookingId}`);
    const data = res?.data;
    return Array.isArray(data) ? data[0] : data;
  } catch { return null; }
}
async function fetchAccommodation(accId, roomTypeId) {
  try {
    const res = await AxiosClient("accommodations-rooms").get(
      `/acc/${accId}/roomType/${roomTypeId}`
    );
    const row = Array.isArray(res?.data) ? res.data[0] : null;
    if (!row) return null;
    const INDEX = { NAME: 10, ADDRESS: 1, IMAGE_URL: 16, BASE_PRICE: 22 };
    return {
      name: row[INDEX.NAME] ?? "이름 없음",
      location: row[INDEX.ADDRESS] ?? "-",
      price: row[INDEX.BASE_PRICE] ?? 0,
      imageUrl: row[INDEX.IMAGE_URL] ?? "",
    };
  } catch { return null; }
}
async function fetchBookingByUser(authUserId, accId, roomTypeId) {
  try {
    if (!authUserId) return null;
    const res = await AxiosClient("bookings").get(`/user/${authUserId}`, {
      params: { accommodationId: accId, roomTypeId },
    });
    const list = res?.data;
    return Array.isArray(list) && list.length > 0 ? list[0] : null;
  } catch { return null; }
}

/* ===== 컴포넌트 ===== */
export default function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: bookingIdFromPath } = useParams();
  const [search] = useSearchParams();
  const bookingId = Number(search.get("bid")) || Number(bookingIdFromPath);

  const { auth } = React.useContext(AuthContext);

  const [booking, setBooking] = React.useState(null);
  const [payment, setPayment] = React.useState(null);
  const [accommodationData, setAccommodationData] = React.useState(null);

  // 예약/결제 조립
  React.useEffect(() => {
    const st = location.state;
    const looksLikeBooking =
      st && (st.checkInDate || st.totalAmount != null || st.paymentMethod);

    // 예약
    if (st?.booking) setBooking(st.booking);
    else if (looksLikeBooking) setBooking(st);
    else {
      const lastPayload = tryParse(sessionStorage.getItem("lastBookingPayload"));
      const lastResult = tryParse(sessionStorage.getItem("lastBookingResult"));
      if (lastResult && Number(lastResult.bookingId) === bookingId && lastResult.booking)
        setBooking(lastResult.booking);
      else if (lastPayload && Number(lastPayload.bookingId) === bookingId && lastPayload.booking)
        setBooking(lastPayload.booking);
    }

    // 결제
    if (st?.payment) setPayment(st.payment);
    else {
      const lastPayment = tryParse(sessionStorage.getItem("lastPayment"));
      const lastPayload = tryParse(sessionStorage.getItem("lastBookingPayload"));
      const lastResult = tryParse(sessionStorage.getItem("lastBookingResult"));
      const cand =
        (lastPayment && Number(lastPayment.bookingId) === bookingId && lastPayment) ||
        (lastPayload && Number(lastPayload.bookingId) === bookingId && lastPayload.payment) ||
        (lastResult && Number(lastResult.bookingId) === bookingId && lastResult.payment);
      if (cand) setPayment(cand);
      else {
        fetchPaymentByBookingId(bookingId).then((p) => {
          if (!p) return;
          setPayment({
            bookingId,
            method: p.method || p.paymentMethod,
            status: p.status || p.paymentStatus,
            approvedAt: p.approvedAt,
            card: p.cardIssuer ? { issuer: p.cardIssuer, last4: p.last4, exp: p.exp } : undefined,
            bank: p.bankName ? { name: p.bankName, depositorName: p.depositorName } : undefined,
            vbank: p.vbank,
          });
        });
      }
    }
  }, [bookingId, location.state]);

  // 숙소/예약 보강
  React.useEffect(() => {
    const st = location.state || {};
    const accId =
      st.accommodationId ?? booking?.accommodationId ?? (st.booking && st.booking.accommodationId);
    const roomTypeId =
      st.roomTypeId ?? booking?.roomTypeId ?? (st.booking && st.booking.roomTypeId);

    if (accId && roomTypeId) {
      fetchAccommodation(accId, roomTypeId).then((acc) => acc && setAccommodationData(acc));
    }
    if (!booking && auth?.userId && accId && roomTypeId) {
      fetchBookingByUser(auth.userId, accId, roomTypeId).then((b) => b && setBooking(b));
    }
  }, [booking, location.state, auth?.userId]);

  // 보기용 머지
  const view = React.useMemo(() => {
    const method = payment?.method || booking?.paymentMethod;
    const status = payment?.status || booking?.paymentStatus;
    const methodLabel = METHOD_LABEL[method] || method || PLACEHOLDER;

    let statusClass = "badge";
    const skey = (status || "").toLowerCase();
    if (skey === "paid" || skey === "success") statusClass += " badge--paid";
    else if (skey === "pending") statusClass += " badge--pending";
    else if (skey === "refunded") statusClass += " badge--refunded";
    else if (["cancel", "canceled", "failed"].includes(skey)) statusClass += " badge--cancel";

    return {
      method,
      methodLabel,
      status: status ?? PLACEHOLDER,
      statusClass,
      cardIssuer: payment?.card?.issuer || booking?.cardIssuer || PLACEHOLDER,
      last4: payment?.card?.last4 || PLACEHOLDER,
      exp: payment?.card?.exp || PLACEHOLDER,
      bankName: payment?.bank?.name || booking?.bankName || PLACEHOLDER,
      depositorName: payment?.bank?.depositorName || booking?.depositorName || PLACEHOLDER,
      vbank: payment?.vbank,
      approvedAt: payment?.approvedAt, // optional
    };
  }, [payment, booking]);

  const resolvedBooking = booking || {};

  return (
    <div className="booking-confirm booking-confirmation">
      <h2>예약이 완료되었습니다.</h2>

      {accommodationData && (
        <div className="accommodation-summary">
          {accommodationData.imageUrl ? (
            <img src={accommodationData.imageUrl} alt={accommodationData.name} className="summary-image" />
          ) : <div className="summary-image placeholder" />}
          <div className="summary-text">
            <h3>{accommodationData.name}</h3>
            <p><i className="bi bi-geo-alt" /> {accommodationData.location}</p>
            <p>{fmtWon(accommodationData.price)}</p>
          </div>
        </div>
      )}

      {/* 예약 정보 */}
      <section className="section">
        <h3>예약 정보</h3>
        <table className="info">
          <tbody>
            <tr>
              <th>예약번호</th>
              <td>{resolvedBooking.bookingId ?? bookingId ?? PLACEHOLDER}</td>
            </tr>
            <tr>
              <th>체크인</th>
              <td>{resolvedBooking.checkInDate || PLACEHOLDER}</td>
            </tr>
            <tr>
              <th>체크아웃</th>
              <td>{resolvedBooking.checkOutDate || PLACEHOLDER}</td>
            </tr>
            <tr>
              <th>총 결제 금액</th>
              <td className="text-right em">{fmtWon(resolvedBooking.totalAmount)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 결제 정보 */}
      <section className="section">
        <h3>결제 정보</h3>
        <table className="info">
          <tbody>
            <tr>
              <th>결제 수단</th>
              <td>{view.methodLabel}</td>
            </tr>
            <tr>
              <th>결제 상태</th>
              <td><span className={view.statusClass}>{view.status}</span></td>
            </tr>

            {/* 카드 */}
            {view.method === "card" && (
              <>
                <tr><th>카드사</th><td>{view.cardIssuer}</td></tr>
                <tr><th>마지막 네 자리</th><td>{view.last4 === PLACEHOLDER ? PLACEHOLDER : `**** **** **** ${view.last4}`}</td></tr>
                <tr><th>유효기간</th><td>{view.exp}</td></tr>
                {view.approvedAt && (
                  <tr><th>승인 시각</th><td>{formatKRDate(view.approvedAt)}</td></tr>
                )}
              </>
            )}

            {/* 계좌이체(transfer 포함) */}
            {(view.method === "bank" || view.method === "transfer") && (
              <>
                <tr><th>이체 은행</th><td>{view.bankName}</td></tr>
                <tr><th>입금자명</th><td>{view.depositorName}</td></tr>
                {view.approvedAt && (
                  <tr><th>승인 시각</th><td>{formatKRDate(view.approvedAt)}</td></tr>
                )}
              </>
            )}

            {/* 가상계좌 */}
            {view.method === "vbank" && (
              <>
                <tr><th>입금계좌</th><td>{(view.vbank?.bank || PLACEHOLDER)} {(view.vbank?.accountNo || PLACEHOLDER)}</td></tr>
                <tr><th>예금주</th><td>{view.vbank?.holder || view.depositorName || PLACEHOLDER}</td></tr>
                <tr><th>입금기한</th><td>{view.vbank?.expireAt ? formatKRDate(view.vbank.expireAt) : PLACEHOLDER}</td></tr>
                {view.approvedAt && (
                  <tr><th>승인 시각</th><td>{formatKRDate(view.approvedAt)}</td></tr>
                )}
              </>
            )}

            {/* 간편결제(kakao/naver/toss) */}
            {["kakao", "naver", "toss"].includes(view.method) && view.approvedAt && (
              <tr><th>승인 시각</th><td>{formatKRDate(view.approvedAt)}</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* 액션 */}
      <div className="actions">
        <button onClick={() => navigate("/")}>메인으로</button>
        <button
          onClick={() =>
            navigate(
              bookingId ? `/mypage/reservations?focus=${bookingId}` : "/mypage/reservations"
            )
          }
        >
          내 예약 확인
        </button>
      </div>
    </div>
  );
}
