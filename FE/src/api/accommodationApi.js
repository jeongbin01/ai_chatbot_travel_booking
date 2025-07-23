// src/api/accommodationApi.js
import axios from "axios";

const BASE_URL = "/api/accommodations";

// 전체 숙소 목록
export const fetchAccommodations = () => axios.get(BASE_URL);

// ID로 숙소 조회
export const fetchAccommodationById = (id) => axios.get(`${BASE_URL}/${id}`);

// 키워드 검색
export const searchAccommodations = (keyword) =>
  axios.get(`${BASE_URL}/search?keyword=${keyword}`);



// GET /api/accommodations               → 프론트에서 전체 숙소 목록 불러올 때 사용
// GET /api/accommodations/search?keyword=xxx  → 숙소 이름으로 검색
// GET /api/accommodations/{id}         → (사용 안 함) 상세 조회용
// POST /api/accommodations             → (사용 안 함) 등록/수정
// DELETE /api/accommodations/{id}      → (사용 안 함) 삭제
// GET /api/accommodations/user/{userId}→ (사용 안 함) 소유자 기준 숙소 목록