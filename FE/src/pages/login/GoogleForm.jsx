  import React, { useEffect, useState } from 'react';

  function GoogleLoginButton() {
    const [accessToken, setAccessToken] = useState(null);

    // 컴포넌트 마운트 시, URL에서 access_token 가져와서 저장
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('access_token');
      if (token) {
        localStorage.setItem('accessToken', token);
        setAccessToken(token);

        // URL에서 토큰 제거 (주소창 깔끔하게)
        window.history.replaceState({}, document.title, '/');
      } else {
        // 로컬스토리지에 토큰 있으면 상태에 세팅
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) setAccessToken(storedToken);
      }
    }, []);

    // 구글 OAuth 로그인 시작
    const handleGoogleLogin = () => {
      window.location.href = 'http://localhost:8888/oauth2/authorization/google';
    };

    // 로그아웃 시 토큰 삭제 및 상태 초기화
    const handleLogout = () => {
      localStorage.removeItem('accessToken');
      setAccessToken(null);
    };

    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        {accessToken ? (
          <div>
            <p><strong>JWT 토큰:</strong></p>
            <pre style={{
              wordBreak: 'break-all',
              backgroundColor: '#f0f0f0',
              padding: '1rem',
              borderRadius: '8px',
              maxWidth: '90%',
              margin: '1rem auto',
            }}>
              {accessToken}
            </pre>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#e53935',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={handleGoogleLogin}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Google 계정으로 로그인
          </button>
        )}
      </div>
    );
  }

  export default GoogleLoginButton;
