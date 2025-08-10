// src/api/amenitiesApi.js
import axios from "axios";

const BASE_URL = "/app/amenities";

/** 전체 편의시설 목록 */
export const fetchAmenityTypes = () => axios.get(BASE_URL);

/** 편의시설 단건 조회 */
export const fetchAmenityById = (id) => axios.get(`${BASE_URL}/${id}`);
