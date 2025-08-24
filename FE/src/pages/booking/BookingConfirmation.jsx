// src/pages/booking/BookingConfirmation.jsx
import React from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { AxiosClient } from "../../api/AxiosController";
import "../../styles/pages/BookingConfirmation.css";
import { AuthContext } from "../../context/AuthContext";

/* ===== 라벨/포맷 ===== */
const METHOD_LABEL = {
  card: "카드결제",
  bank: "계좌이체",
  transfer: "계좌이체",
  vbank: "가상계좌",
  kakao: "카카오페이",
  naver: "네이버페이",
  toss: "토스페이",
};
const PLACEHOLDER = "—";

const pad2 = (n) => String(n).padStart(2, "0");

// 한국형 날짜 포맷 (예: 2025년 8월 27일 11:22)
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

// 레거시 ISO 표시가 필요할 때(보조)
const fmtDateTime = (iso) => {
  if (!iso) return PLACEHOLDER;
  const d = new Date(iso);
  if (isNaN(d)) return PLACEHOLDER;
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(
    d.getDate()
  )} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
};

const fmtWon = (n) =>
  n == null ? PLACEHOLDER : `${Number(n).toLocaleString("ko-KR")}원`;

const tryParse = (s) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};

/* ===== 백엔드 호출 유틸 ===== */
async function fetchPaymentByBookingId(bookingId) {
  try {
    // 예: /app/payment/booking/{bookingId} 가 백엔드에 매핑되어 있다고 가정
    const res = await AxiosClient.get(`/payment/booking/${bookingId}`);
    const data = res?.data;
    return Array.isArray(data) ? data[0] : data;
  } catch {
    return null;
  }
}

async function fetchAccommodation(accId, roomTypeId) {
  try {
    const res = await AxiosClient("accommodations-rooms").get(
      `/acc/${accId}/roomType/${roomTypeId}`
    );
    const row = Array.isArray(res?.data) ? res.data[0] : null;
    if (!row) return null;

    // 프로젝트에서 쓰던 인덱스 맵 유지
    const INDEX = {
      NAME: 10,
      ADDRESS: 1,
      IMAGE_URL: 16,
      BASE_PRICE: 22,
      RTI_IMG: 23,
    };
    return {
      name: row[INDEX.NAME] ?? "이름 없음",
      location: row[INDEX.ADDRESS] ?? "-",
      price: row[INDEX.BASE_PRICE] ?? 0,
      imageUrl: row[INDEX.IMAGE_URL] ?? "",
    };
  } catch {
    return null;
  }
}

async function fetchBookingByUser(authUserId, accId, roomTypeId) {
  try {
    if (!authUserId) return null;
    const res = await AxiosClient("bookings").get(`/user/${authUserId}`, {
      params: { accommodationId: accId, roomTypeId },
    });
    const list = res?.data;
    return Array.isArray(list) && list.length > 0 ? list[0] : null;
  } catch {
    return null;
  }
}

/* ===== 메인 컴포넌트 ===== */
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

  // 1) state / 2) session / 3) 백엔드 순으로 예약/결제/숙소 데이터 조립
  React.useEffect(() => {
    const st = location.state; // { booking, payment, accommodationId, roomTypeId, ... } or flat fields
    const looksLikeBooking =
      st && (st.checkInDate || st.totalAmount != null || st.paymentMethod);

    // ---- 예약 ----
    if (st?.booking) setBooking(st.booking);
    else if (looksLikeBooking) setBooking(st);
    else {
      const lastPayload = tryParse(
        sessionStorage.getItem("lastBookingPayload")
      ); // { bookingId, booking, payment? }
      const lastResult = tryParse(
        sessionStorage.getItem("lastBookingResult")
      ); // { bookingId, booking, payment }
      if (
        lastResult &&
        Number(lastResult.bookingId) === bookingId &&
        lastResult.booking
      ) {
        setBooking(lastResult.booking);
      } else if (
        lastPayload &&
        Number(lastPayload.bookingId) === bookingId &&
        lastPayload.booking
      ) {
        setBooking(lastPayload.booking);
      }
    }

    // ---- 결제 ----
    if (st?.payment) setPayment(st.payment);
    else {
      const lastPayment = tryParse(sessionStorage.getItem("lastPayment"));
      const lastPayload = tryParse(
        sessionStorage.getItem("lastBookingPayload")
      );
      const lastResult = tryParse(
        sessionStorage.getItem("lastBookingResult")
      );

      const cand =
        (lastPayment &&
          Number(lastPayment.bookingId) === bookingId &&
          lastPayment) ||
        (lastPayload &&
          Number(lastPayload.bookingId) === bookingId &&
          lastPayload.payment) ||
        (lastResult &&
          Number(lastResult.bookingId) === bookingId &&
          lastResult.payment);

      if (cand) setPayment(cand);
      else {
        // 백엔드에서 결제 보강 시도
        fetchPaymentByBookingId(bookingId).then((p) => {
          if (!p) return;
          setPayment({
            bookingId,
            method: p.method || p.paymentMethod, // card | vbank | bank ...
            status: p.status || p.paymentStatus, // PAID | PENDING ...
            approvedAt: p.approvedAt,
            card:
              p.card ||
              (p.cardIssuer
                ? { issuer: p.cardIssuer, last4: p.last4, exp: p.exp }
                : undefined),
            bank:
              p.bank ||
              (p.bankName || p.depositorName
                ? { name: p.bankName, depositorName: p.depositorName }
                : undefined),
            vbank: p.vbank, // { bank, accountNo, holder, expireAt }
          });
        });
      }
    }
  }, [bookingId, location.state]);

  // 숙소/예약 상세 보강(필요한 경우만)
  React.useEffect(() => {
    // 우선순위: state → booking → (없으면 user 기반 조회)
    const st = location.state || {};
    const accId =
      st.accommodationId ??
      booking?.accommodationId ??
      (st.booking && st.booking.accommodationId);
    const roomTypeId =
      st.roomTypeId ??
      booking?.roomTypeId ??
      (st.booking && st.booking.roomTypeId);

    // 숙소 요약
    if (accId && roomTypeId) {
      fetchAccommodation(accId, roomTypeId).then((acc) => {
        if (acc) setAccommodationData(acc);
      });
    }

    // 예약 상세가 비어있으면 user 기반 조회(목록 첫 건)
    if (!booking && auth?.userId && accId && roomTypeId) {
      fetchBookingByUser(auth.userId, accId, roomTypeId).then((b) => {
        if (b) setBooking(b);
      });
    }
  }, [booking, location.state, auth?.userId]);

  // 보기용 머지
  const view = React.useMemo(() => {
    const method = payment?.method || booking?.paymentMethod;
    const status = payment?.status || booking?.paymentStatus;

    const methodLabel = METHOD_LABEL[method] || method || PLACEHOLDER;

    // 상태 배지
    const key = (status || "").toString().toLowerCase();
    let statusClass = "badge";
    if (key === "paid" || key === "success") statusClass += " badge--paid";
    else if (key === "pending") statusClass += " badge--pending";
    else if (key === "refunded") statusClass += " badge--refunded";
    else if (key === "cancel" || key === "canceled" || key === "failed")
      statusClass += " badge--cancel";

    return {
      method,
      methodLabel,
      status: status ?? PLACEHOLDER,
      statusClass,
      // 카드
      cardIssuer:
        payment?.card?.issuer || booking?.cardIssuer || PLACEHOLDER,
      last4: payment?.card?.last4 || PLACEHOLDER,
      exp: payment?.card?.exp || PLACEHOLDER,
      // 은행
      bankName: payment?.bank?.name || booking?.bankName || PLACEHOLDER,
      depositorName:
        payment?.bank?.depositorName || booking?.depositorName || PLACEHOLDER,
      // vbank
      vbank: payment?.vbank,
      // 승인시각
      approvedAt: payment?.approvedAt,
    };
  }, [payment, booking]);

  const resolvedBooking = booking || {}; // 안전 폴백

  return (
    <div className="booking-confirm booking-confirmation">
      <h2>예약이 완료되었습니다 🎉</h2>

      {/* 숙소 요약 (있을 때만) */}
      {accommodationData && (
        <div className="accommodation-summary">
          {accommodationData.imageUrl ? (
            <img
              src={accommodationData.imageUrl}
              alt={accommodationData.name}
              className="summary-image"
            />
          ) : (
            <div className="summary-image placeholder" />
          )}
          <div className="summary-text">
            <h3>
              {accommodationData.name}
            </h3>
            <p>
              <i className="bi bi-geo-alt"></i> {accommodationData.location}
            </p>
            <p> {fmtWon(accommodationData.price)}
            </p>
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
              <td className="text-right em">
                {fmtWon(resolvedBooking.totalAmount)}
              </td>
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
              <td>
                <span className={view.statusClass}>{view.status}</span>
              </td>
            </tr>

            {/* 카드 결제 상세 */}
            {view.method === "card" && (
              <>
                <tr>
                  <th>카드사</th>
                  <td>{view.cardIssuer}</td>
                </tr>
                <tr>
                  <th>마지막 네 자리</th>
                  <td>
                    {view.last4 === PLACEHOLDER
                      ? PLACEHOLDER
                      : `**** **** **** ${view.last4}`}
                  </td>
                </tr>
                <tr>
                  <th>유효기간</th>
                  <td>{view.exp}</td>
                </tr>
                <tr>
                  <th>승인 시각</th>
                  <td>
                    {view.approvedAt
                      ? formatKRDate(view.approvedAt)
                      : PLACEHOLDER}
                  </td>
                </tr>
              </>
            )}

            {/* 계좌이체 상세 */}
            {view.method === "bank" && (
              <>
                <tr>
                  <th>이체 은행</th>
                  <td>{view.bankName}</td>
                </tr>
                <tr>
                  <th>입금자명</th>
                  <td>{view.depositorName}</td>
                </tr>
                <tr>
                  <th>승인 시각</th>
                  <td>
                    {view.status.toUpperCase() === "PAID"
                      ? formatKRDate(view.approvedAt)
                      : "입금 대기 중"}
                  </td>
                </tr>
              </>
            )}

            {/* 가상계좌 상세 */}
            {view.method === "vbank" && (
              <>
                <tr>
                  <th>입금계좌</th>
                  <td>
                    {(view.vbank?.bank || PLACEHOLDER)}{" "}
                    {(view.vbank?.accountNo || PLACEHOLDER)}
                  </td>
                </tr>
                <tr>
                  <th>예금주</th>
                  <td>{view.vbank?.holder || view.depositorName || PLACEHOLDER}</td>
                </tr>
                <tr>
                  <th>입금기한</th>
                  <td>
                    {view.vbank?.expireAt
                      ? formatKRDate(view.vbank.expireAt)
                      : PLACEHOLDER}
                  </td>
                </tr>
                <tr>
                  <th>승인 시각</th>
                  <td>
                    {view.status.toUpperCase() === "PAID"
                      ? formatKRDate(view.approvedAt)
                      : "입금 대기 중"}
                  </td>
                </tr>
              </>
            )}

            {/* 카카오페이 등 기타 */}
            {(view.method === "kakao" ||
              (view.method &&
                !["card", "bank", "vbank"].includes(view.method))) && (
                <>
                  <tr>
                    <th>승인 시각</th>
                    <td>
                      {view.approvedAt
                        ? formatKRDate(view.approvedAt)
                        : PLACEHOLDER}
                    </td>
                  </tr>
                </>
              )}

            {/* 공통(필요시) */}
            {!view.method && (
              <tr>
                <th>승인 시각</th>
                <td>
                  {view.approvedAt
                    ? formatKRDate(view.approvedAt)
                    : PLACEHOLDER}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* 액션 */}
      <div className="actions">
        <button onClick={() => navigate("/")}>메인으로</button>
        <button onClick={() => navigate("/mypage/reservations")}>
          내 예약 확인
        </button>
        <button
          onClick={() => {
            sessionStorage.removeItem("lastPayment");
            sessionStorage.removeItem("lastBookingPayload");
            sessionStorage.removeItem("lastBookingResult");
            window.location.reload();
          }}
        >
          세션 초기화
        </button>
      </div>
    </div>
  );
}
