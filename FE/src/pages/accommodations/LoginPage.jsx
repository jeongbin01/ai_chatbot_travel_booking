import React from 'react';
import { loginWithGoogle } from '../../api/auth';

export default function LoginPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>로그인 / 회원가입</h1>
      <button onClick={loginWithGoogle}>
        Google 계정으로 로그인
      </button>
    </div>
  );
}