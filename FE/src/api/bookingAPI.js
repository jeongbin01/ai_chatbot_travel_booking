// src/api/bookingAPI.js
import axios from "axios";

const BASE_URL = "/app/bookings";

// ✅ 전체 예약 목록 조회
export const fetchBookings = () => axios.get(BASE_URL).then((res) => res.data);

// ✅ 예약 ID로 단건 조회
export const fetchBookingById = (bookingId) =>
  axios.get(`${BASE_URL}/${bookingId}`).then((res) => res.data);

// ✅ 사용자 ID로 예약 목록 조회
export const fetchBookingsByUserId = (userId) =>
  axios.get(`${BASE_URL}/user/${userId}`).then((res) => res.data);

// ✅ 숙소 ID로 예약 목록 조회
export const fetchBookingsByAccommodationId = (accommodationId) =>
  axios
    .get(`${BASE_URL}/accommodation/${accommodationId}`)
    .then((res) => res.data);

// ✅ 룸타입 ID로 예약 목록 조회
export const fetchBookingsByRoomTypeId = (roomTypeId) =>
  axios.get(`${BASE_URL}/room-type/${roomTypeId}`).then((res) => res.data);

// ✅ 예약 상태별 조회
export const fetchBookingsByStatus = (status) =>
  axios.get(`${BASE_URL}/status/${status}`).then((res) => res.data);

// ✅ 날짜 범위로 예약 조회
export const fetchBookingsByDateRange = (start, end) =>
  axios
    .get(`${BASE_URL}/date`, {
      params: { start, end },
    })
    .then((res) => res.data);

// ✅ 사용자 ID + 상태로 예약 조회
export const fetchBookingsByUserIdAndStatus = (userId, status) =>
  axios
    .get(`${BASE_URL}/user/${userId}/status/${status}`)
    .then((res) => res.data);

// ✅ 숙소 ID + 체크인 날짜로 예약 조회
export const fetchBookingsByAccommodationAndCheckinDate = (
  accommodationId,
  date
) =>
  axios
    .get(`${BASE_URL}/accommodation/${accommodationId}/checkin`, {
      params: { date },
    })
    .then((res) => res.data);

// ✅ 특정 상태의 최신 예약 조회
export const fetchRecentBookingsByStatus = (status) =>
  axios.get(`${BASE_URL}/recent/${status}`).then((res) => res.data);

// ✅ 예약 생성
export const createBooking = (bookingData) =>
  axios.post(BASE_URL, bookingData).then((res) => res.data);

// ✅ 예약 수정 (PUT 전체 업데이트)
export const updateBooking = (bookingId, updatedData) =>
  axios.put(`/app/bookings/${bookingId}`, updatedData).then((res) => res.data);

// ✅ 예약 삭제
export const deleteBooking = (bookingId) =>
  axios.delete(`${BASE_URL}/${bookingId}`).then((res) => res.data);
