import axios from "axios";

const GUEST_BASE = "/app/booking-guest";

// 게스트 단건 조회 (guest_id 기준)
export const fetchGuestById = (guestId) =>
  axios.get(`${GUEST_BASE}/${guestId}`);

// 특정 예약의 모든 게스트 조회 (booking_id 기준)
export const fetchGuestsByBookingId = (bookingId) =>
  axios.get(`${GUEST_BASE}/booking/${bookingId}`);

// 해당 예약의 대표 연락자 게스트 조회
export const fetchPrimaryContactByBookingId = (bookingId) =>
  axios.get(`${GUEST_BASE}/booking/${bookingId}/primary-contact`);
