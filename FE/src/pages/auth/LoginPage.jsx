import React from 'react';
import { loginWithGoogle } from '../../api/auth';

const LoginPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>로그인 페이지</h2>
      <button onClick={loginWithGoogle}>Google로 로그인</button>
    </div>
  );
};

export default LoginPage;
