// src/pages/user/Reservations.jsx
import React, { useEffect, useMemo, useState, useContext, useRef } from "react";
import "../../styles/utils/Reservations.css";
import "../../styles/utils/MyPageLayout.css";
import MyPageAside from "./MyPageAside";
import { AxiosClient } from "../../api/AxiosController.jsx";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

/* ===== 로컬 폴백 이미지 임포트 ===== */
import IMG_GAPYEONG from "../../assets/images/domestic/가평 풀빌라.jpg";
import IMG_GANGHWADO_PENSION from "../../assets/images/domestic/강화도 펜션.jpg";
import IMG_GIMHAE_HOTEL from "../../assets/images/domestic/김해 호텔.jpg";
import IMG_NAMHAE_SWEET from "../../assets/images/domestic/남해 스위트.jpg";
import IMG_DAEJEON_HOTEL from "../../assets/images/domestic/대전 호텔.jpg";
import IMG_BUSAN_GWANGAN from "../../assets/images/domestic/부산 광안대교 호텔.jpg";
import IMG_BUSAN_HAEUNDAE from "../../assets/images/domestic/부산 해운대 리조트.jpg";
import IMG_SORAK_RESORT from "../../assets/images/domestic/설악산 리조트.jpg";
import IMG_SOKCHO_HOTEL from "../../assets/images/domestic/속초 호텔.jpg";
import IMG_SONGDO_HOTEL from "../../assets/images/domestic/송도 호텔.jpg";
import IMG_SUNCHEON_HANOK from "../../assets/images/domestic/순천 한옥 호텔.jpg";
import IMG_YEOSU_RESORT from "../../assets/images/domestic/여수 리조트.jpg";
import IMG_ULSAN_HOTEL from "../../assets/images/domestic/울산 호텔.jpg";
import IMG_JEONJU_HOTEL from "../../assets/images/domestic/전주 호텔.jpg";
import IMG_JEJU_SEOGWIPO from "../../assets/images/domestic/제주 서귀포 리조트.jpg";
import IMG_JEJU_HOTEL from "../../assets/images/domestic/제주 호텔.jpg";
import IMG_CHEONGDO_PENSION from "../../assets/images/domestic/청도 펜션.jpg";
import IMG_PYEONGCHANG_RESORT from "../../assets/images/domestic/평창 리조트.jpg";
import IMG_POHANG_HOTEL from "../../assets/images/domestic/포항 호텔.jpg";
/* ✅ 강릉 폴백 */
import IMG_GANGNEUNG_HOTEL from "../../assets/images/domestic/강릉 호텔.jpg";

// 해외
import IMG_ROME_HOTEL from "../../assets/images/overseas/로마 호텔.jpg";
import IMG_BANGKOK_HOTEL from "../../assets/images/overseas/방콕 호텔.jpg";
import IMG_SINGAPORE_HOTEL from "../../assets/images/overseas/싱가포르 호텔.jpg";

/* ===== 유틸 ===== */
const isDomesticYes = (v) =>
  v === "Y" || v === "y" || v === true || v === "true" || v === 1 || v === "1";
const isDomesticNo = (v) =>
  v === "N" ||
  v === "n" ||
  v === false ||
  v === "false" ||
  v === 0 ||
  v === "0";

const pad2 = (n) => String(n).padStart(2, "0");
const fmtDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
const fmtWon = (n) => {
  const num = typeof n === "number" ? n : Number(n ?? 0);
  if (Number.isNaN(num)) return "";
  return `${num.toLocaleString("ko-KR")}원`;
};

// 절대경로 베이스( Vite면 env, 아니면 origin )
const ASSET_BASE =
  (typeof import.meta !== "undefined" && import.meta?.env?.VITE_ASSET_BASE) ||
  (typeof window !== "undefined" ? window.location.origin : "");

/** 서버/상대경로 이미지 선택 + 절대 URL 보정 */
const pickImageUrl = (accOrBooking) => {
  const c = accOrBooking || {};
  const candidates = [
    c.imageUrl,
    c.accommodationImage,
    c.image_url,
    c.thumbnailUrl,
    c.thumbnail_url,
    c.mainImageUrl,
    c.main_image_url,
    c.image,
    c.images?.[0]?.url,
    c.photos?.[0]?.url,
  ].filter(Boolean);

  const raw = candidates.find((v) => typeof v === "string" && v.trim());
  if (!raw) return "";

  if (/^https?:\/\//i.test(raw)) return raw; // 절대경로면 그대로
  if (!ASSET_BASE) return String(raw).replace(/^\/+/, ""); // SSR 안전장치

  return `${String(ASSET_BASE).replace(/\/+$/, "")}/${String(raw).replace(
    /^\/+/,
    ""
  )}`;
};

/** 이름/지역 키워드로 로컬 폴백 */
const LOCAL_IMAGES = [
  { keys: ["가평", "풀빌라", "폴빌라"], img: IMG_GAPYEONG },
  { keys: ["강화", "강화도", "펜션"], img: IMG_GANGHWADO_PENSION },
  { keys: ["김해"], img: IMG_GIMHAE_HOTEL },
  { keys: ["남해", "스위트"], img: IMG_NAMHAE_SWEET },
  { keys: ["대전"], img: IMG_DAEJEON_HOTEL },
  { keys: ["부산", "광안", "광안대교"], img: IMG_BUSAN_GWANGAN },
  { keys: ["부산", "해운대", "리조트"], img: IMG_BUSAN_HAEUNDAE },
  { keys: ["설악", "설악산"], img: IMG_SORAK_RESORT },
  { keys: ["속초"], img: IMG_SOKCHO_HOTEL },
  { keys: ["송도"], img: IMG_SONGDO_HOTEL },
  { keys: ["순천", "한옥"], img: IMG_SUNCHEON_HANOK },
  { keys: ["여수"], img: IMG_YEOSU_RESORT },
  { keys: ["울산"], img: IMG_ULSAN_HOTEL },
  { keys: ["전주"], img: IMG_JEONJU_HOTEL },
  { keys: ["제주", "서귀포"], img: IMG_JEJU_SEOGWIPO },
  { keys: ["제주"], img: IMG_JEJU_HOTEL },
  { keys: ["청도"], img: IMG_CHEONGDO_PENSION },
  { keys: ["평창"], img: IMG_PYEONGCHANG_RESORT },
  { keys: ["포항"], img: IMG_POHANG_HOTEL },
  /* ✅ 강릉 관련 키워드 확장 */
  {
    keys: ["강릉", "경포", "경포대", "주문진", "안목", "사천진", "정동진"],
    img: IMG_GANGNEUNG_HOTEL,
  },
  // 해외
  { keys: ["로마", "rome"], img: IMG_ROME_HOTEL },
  { keys: ["방콕", "bangkok"], img: IMG_BANGKOK_HOTEL },
  { keys: ["싱가포르", "singapore"], img: IMG_SINGAPORE_HOTEL },
];

const pickLocalFallback = ({ name = "", location = "" } = {}) => {
  const text = `${name} ${location}`.toLowerCase();
  for (const { keys, img } of LOCAL_IMAGES) {
    if (keys.some((k) => text.includes(k.toLowerCase()))) return img;
  }
  return null;
};

/* 상태 뱃지 */
const STATUS_BADGE = {
  CONFIRMED: { label: "예약완료", cls: "ok" },
  COMPLETED: { label: "체크아웃", cls: "muted" },
  CHECKED_OUT: { label: "체크아웃", cls: "muted" },
  CANCELED: { label: "취소", cls: "cancel" },
  PENDING: { label: "대기", cls: "warn" },
};

const TABS = ["국내숙소", "해외숙소", "액티비티"];
const NO_IMAGE = "/images/no-image.png";

export default function Reservations() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("국내숙소");
  const [reservationList, setReservationList] = useState({
    국내숙소: [],
    해외숙소: [],
    액티비티: [],
  });

  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");

  const [focusId, setFocusId] = useState(() => {
    const url = new URLSearchParams(location.search);
    return url.get("focus") || sessionStorage.getItem("justBookedId") || "";
  });
  const focusedRef = useRef(null);

  useEffect(() => {
    if (!auth || !auth.userId) {
      navigate("/login", {
        replace: true,
        state: { redirectTo: location.pathname + location.search },
      });
      return;
    }

    const fetchReservations = async () => {
      setLoading(true);
      setError("");
      try {
        // ✅ AxiosClient는 "함수" → 먼저 인스턴스를 만들어 사용
        const apiApp = AxiosClient(""); // base: http://.../app/
        const apiBookings = AxiosClient("bookings"); // base: http://.../app/bookings

        // 우선순위로 여러 엔드포인트 시도
        const attempts = [
          () => apiApp.get(`/bookings/user/${auth.userId}`),
          () => apiBookings.get(`/user/${auth.userId}`),
        ];

        let data = [];
        for (const run of attempts) {
          try {
            const res = await run();
            const arr = Array.isArray(res?.data) ? res.data : [];
            if (arr.length) {
              data = arr;
              break;
            }
          } catch {
            // 개별 실패는 무시하고 다음 시도
          }
        }

        // 마지막 안전망(혹시 베이스가 다른 경우)
        if (!data.length) {
          try {
            const res = await AxiosClient("bookings").get(
              `/user/${auth.userId}`
            );
            data = Array.isArray(res?.data) ? res.data : [];
          } catch {
            // noop
          }
        }

        // ====== 정규화 ======
        const normalize = (b) => {
          const accRaw = b?.accommodation ?? {
            id: b?.accommodationId ?? b?.accommodation_id,
            name: b?.accommodationName ?? b?.accommodation_name,
            location: b?.accommodationLocation ?? b?.accommodation_location,
            imageUrl:
              b?.accommodationImage ??
              b?.imageUrl ??
              b?.image_url ??
              b?.thumbnailUrl ??
              b?.thumbnail_url ??
              b?.mainImageUrl ??
              b?.main_image_url ??
              b?.image ??
              b?.images?.[0]?.url ??
              b?.photos?.[0]?.url,
            isDomestic: b?.isDomestic ?? b?.accommodationIsDomestic,
            type: b?.accommodationType ?? b?.type,
          };

          const statusKey = String(b?.status || "").toUpperCase();

          return {
            bookingId: b?.bookingId ?? b?.id ?? b?.booking_id,
            status: statusKey,
            totalAmount: b?.totalAmount ?? b?.amount ?? b?.total_amount,
            checkInDate: b?.checkInDate ?? b?.check_in_date ?? b?.check_in,
            checkOutDate: b?.checkOutDate ?? b?.check_out_date ?? b?.check_out,
            guests: b?.guests ?? b?.guestCount ?? b?.guest_count,
            accommodation: accRaw,
          };
        };

        const normalized = (data || []).map(normalize);

        const domestic = normalized.filter((b) =>
          isDomesticYes(b?.accommodation?.isDomestic)
        );
        const foreign = normalized.filter((b) =>
          isDomesticNo(b?.accommodation?.isDomestic)
        );
        const activity = normalized.filter(
          (b) =>
            !isDomesticYes(b?.accommodation?.isDomestic) &&
            !isDomesticNo(b?.accommodation?.isDomestic)
        );

        const nothingClassified =
          domestic.length === 0 &&
          foreign.length === 0 &&
          activity.length === 0;
        const domesticFinal = nothingClassified ? normalized : domestic;

        setReservationList({
          국내숙소: domesticFinal,
          해외숙소: foreign,
          액티비티: activity,
        });
      } catch (e) {
        console.error("예약 불러오기 실패:", e);
        setError("예약 내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
        setReservationList({ 국내숙소: [], 해외숙소: [], 액티비티: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.userId]);

  const rawList = reservationList[activeTab] || [];
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return rawList;
    return rawList.filter((it) => {
      const name = (it?.accommodation?.name || "").toLowerCase();
      const loc = (it?.accommodation?.location || "").toLowerCase();
      return name.includes(kw) || loc.includes(kw);
    });
  }, [rawList, keyword]);

  useEffect(() => {
    if (!focusId) return;
    const el = document.querySelector(`[data-booking-id="${focusId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("card-focus");
      focusedRef.current = el;
      setTimeout(() => {
        focusedRef.current?.classList.remove("card-focus");
        sessionStorage.removeItem("justBookedId");
        setFocusId("");
      }, 3000);
    }
  }, [focusId, filtered]);

  const handleFindTrips = () => navigate("/accommodations");

  const labelOf = (isDomestic) => {
    if (isDomesticYes(isDomestic)) return "국내";
    if (isDomesticNo(isDomestic)) return "해외";
    return "액티비티";
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setKeyword("");
    }
  };

  /* ===== 렌더 ===== */
  return (
    <div className="page-wrapper">
      <MyPageAside />
      <section className="page-content">
        <h2>예약 내역</h2>

        {/* 탭 */}
        <div className="reservation-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={tab === activeTab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}{" "}
              <span className="tab-count">{reservationList[tab].length}</span>
            </button>
          ))}
        </div>

        {/* 검색/요약 */}
        <div className="filterbar">
          <div className="searchbox" role="search">
            <i className="bi bi-search" aria-hidden="true" />
            <input
              type="search"
              inputMode="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="숙소/지역 검색"
              aria-label="숙소나 지역으로 검색"
              autoComplete="off"
            />
            {keyword && (
              <button
                className="clear"
                onClick={() => setKeyword("")}
                aria-label="검색어 지우기"
                type="button"
                title="지우기 (Esc)"
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="summary-bar" aria-live="polite">
            <strong>{activeTab}</strong>
            <span className="dot" />
            <span>{`총 ${filtered.length}건`}</span>
          </div>
        </div>

        {/* 로딩/에러/목록 */}
        {loading ? (
          <ul className="reservation-list" aria-busy="true">
            {[...Array(4)].map((_, i) => (
              <li key={i} className="reservation-card skeleton" />
            ))}
          </ul>
        ) : error ? (
          <div className="empty-box" role="alert">
            <p className="empty-title">불러오기 실패</p>
            <p className="empty-sub">{error}</p>
          </div>
        ) : filtered.length > 0 ? (
          <ul className="reservation-list">
            {filtered.map((item) => {
              const acc = item.accommodation || {};
              const status = STATUS_BADGE[item?.status] || null;

              const goDetail = () =>
                navigate(`/mypage/bookings/${item.bookingId}`, {
                  state: { from: "/mypage/reservations" },
                });

              // ① 서버 이미지 → ② 로컬 키워드 폴백 → ③ NO_IMAGE
              const imgSrc =
                pickImageUrl(acc) || pickLocalFallback(acc) || NO_IMAGE;

              return (
                <li
                  key={item.bookingId}
                  data-booking-id={item.bookingId}
                  className="reservation-card"
                  onClick={goDetail}
                  onKeyDown={(e) => e.key === "Enter" && goDetail()}
                  role="button"
                  tabIndex={0}
                >
                  {/* 썸네일 */}
                  <img
                    className="thumb"
                    src={imgSrc}
                    alt={acc.name ? `${acc.name} 대표 이미지` : "숙소 이미지"}
                    loading="lazy"
                    onError={(e) => {
                      if (e.currentTarget.src !== NO_IMAGE)
                        e.currentTarget.src = NO_IMAGE;
                    }}
                  />

                  {/* 메타 */}
                  <div className="res-meta">
                    <h4 title={acc.name || "숙소"}>{acc.name || "숙소"}</h4>

                    <div className="badges">
                      {status && (
                        <span className={`badge ${status.cls}`}>
                          {status.label}
                        </span>
                      )}
                      <span className="badge">{labelOf(acc.isDomestic)}</span>
                    </div>

                    <p className="meta-line">
                      <i className="bi bi-calendar2-week" aria-hidden="true" />{" "}
                      {fmtDate(item.checkInDate)} ~ {fmtDate(item.checkOutDate)}
                      {acc.location && (
                        <>
                          <span className="dot" />
                          <i
                            className="bi bi-geo-alt"
                            aria-hidden="true"
                          />{" "}
                          {acc.location}
                        </>
                      )}
                    </p>

                    <p className="meta-line price">
                      {fmtWon(item.totalAmount)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="empty-box">
            <p className="empty-title">예정된 여행이 없습니다.</p>
            <p className="empty-sub">지금 새로운 예약을 진행해보세요.</p>
            <button
              className="find-button"
              onClick={handleFindTrips}
              type="button"
            >
              <i className="bi bi-search" aria-hidden="true" /> 여행지 찾아보기
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
