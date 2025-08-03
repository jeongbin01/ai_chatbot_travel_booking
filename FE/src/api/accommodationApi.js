// // src/api/accommodationApi.js
// import axios from "axios";

// const BASE_URL = "/api/accommodations";

// // 전체 숙소 목록
// export const fetchAccommodations = () => axios.get(BASE_URL);

// // ID로 숙소 조회
// export const fetchAccommodationById = (id) => axios.get(`${BASE_URL}/${id}`);

// // 키워드 검색
// export const searchAccommodations = (keyword) =>
//   axios.get(`${BASE_URL}/search?keyword=${keyword}`);

// // GET /api/accommodations               → 프론트에서 전체 숙소 목록 불러올 때 사용
// // GET /api/accommodations/search?keyword=xxx  → 숙소 이름으로 검색
// // GET /api/accommodations/{id}         → (사용 안 함) 상세 조회용
// // POST /api/accommodations             → (사용 안 함) 등록/수정
// // DELETE /api/accommodations/{id}      → (사용 안 함) 삭제
// // GET /api/accommodations/user/{userId}→ (사용 안 함) 소유자 기준 숙소 목록

// src/api/accommodationApi.js
import axios from "axios";

const BASE_URL = "/app/accommodations"; // @RequestMapping 기준

//  전체 숙소 목록 조회
export const fetchAccommodations = () => axios.get(BASE_URL);

// ID로 숙소 상세 조회
export const fetchAccommodationById = (id) => axios.get(`${BASE_URL}/${id}`);

// 키워드(이름)로 숙소 검색
export const searchAccommodations = (keyword) =>
  axios.get(`${BASE_URL}/search?keyword=${keyword}`);

// 소유자(userId) 기준 숙소 목록 조회
export const fetchAccommodationsByUserId = (userId) =>
  axios.get(`${BASE_URL}/user/${userId}`);

// 숙소 등록 또는 수정
export const saveAccommodation = (accommodation) =>
  axios.post(BASE_URL, accommodation);

// 숙소 삭제
export const deleteAccommodation = (id) => axios.delete(`${BASE_URL}/${id}`);

// 국내/해외 숙소 필터
export const filterByIsDomestic = (isDomestic) =>
  axios.get(`${BASE_URL}/filter`, { params: { isDomestic } });

// 숙소 이미지 조회
export const fetchAccommodationImages = (accommodationId) =>
  axios.get("/app/accommodation-images", {
    params: { accommodationId },
  });
