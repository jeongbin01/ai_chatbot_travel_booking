// src/api/auth.js
import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://192.168.128.106:8888',
  withCredentials: true,
});

// 현재 로그인된 사용자 정보 조회
export function fetchCurrentUser() {
  return api.get('/api/auth/me');
}

// 로그아웃
export function logout() {
  return api.post('/auth/logout');
}

// 구글 로그인 리디렉션
export function loginWithGoogle() {
  const baseURL = import.meta.env.VITE_API_URL || 'http://192.168.128.106:8888';

  // 만약 환경변수에 localhost가 들어있다면 내부 IP로 변환
  const redirectUrl = baseURL.includes('localhost')
    ? baseURL.replace('localhost', '192.168.128.106')
    : baseURL;

  window.location.href = `${redirectUrl}/oauth2/authorization/google`;
}
