import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://192.168.128.106:8888/api/auth/me', {
          withCredentials: true,
        });
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/');
      } catch (err) {
        console.error('OAuth 로그인 실패', err);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default OAuthCallback;