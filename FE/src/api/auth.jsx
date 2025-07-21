// src/api/auth.js
import axios from 'axios';

const api = axios.create({
  // .env 에 VITE_API_URL=http://192.168.128.106:8888 로 설정했다면
  baseURL: import.meta.env.VITE_API_URL || 'http://192.168.128.106:8888',
  withCredentials: true,
});

/**
 * 현재 로그인된 사용자 정보 조회
 * GET http://{baseURL}/api/auth/me
 */
export function fetchCurrentUser() {
  return api.get('/api/auth/me');
}

/**
 * 구글 OAuth2 로그인 페이지로 리다이렉트
 * redirect: http://{baseURL}/oauth2/authorization/google
 */
export function loginWithGoogle() {
  window.location.href = `${api.defaults.baseURL}/oauth2/authorization/google`;
}
