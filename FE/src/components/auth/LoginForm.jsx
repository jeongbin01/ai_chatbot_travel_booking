import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithCredentials } from '../../api/auth';
import api from '../../api/axios';  // 토큰 헤더 설정용

const LoginForm = () => {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const navigate                  = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await loginWithCredentials({ email, password });
      const { token } = res.data;

      // 1) 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', token);

      // 2) Axios 기본 Header에 토큰 설정 (후속 API 호출에 자동 포함)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 3) 로그인 성공 후 리다이렉트
      navigate('/');
    } catch (err) {
      // 에러 메시지 추출 (백엔드 에러 구조에 맞춰 조정)
      const msg = err.response?.data?.message || '로그인에 실패했습니다.';
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: '0 auto' }}>
      <h2>로그인</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: 12 }}>
        <label>
          이메일
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </label>
      </div>

      <button type="submit" style={{ width: '100%', padding: 10 }}>
        로그인
      </button>
    </form>
  );
};

export default LoginForm;
