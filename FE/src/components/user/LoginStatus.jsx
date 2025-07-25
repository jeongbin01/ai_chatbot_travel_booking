import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


const LoginStatus = () => {
  const { auth} = useContext(AuthContext); 
  
  return (
    <div style={{ textAlign: 'right', marginRight: '12px' }}>
      {auth ? (
        <>
          <span style={{ fontWeight: 'bold' }}>{(auth.nickname)? auth.nickname : auth.username}님 환영합니다!</span>

        </>
      ) : (
        <Link to="/login" style={{ textDecoration: 'none', color: '#333', fontWeight: 500 }}>
          로그인/회원가입
        </Link>
      )}
    </div>
  );
};

export default LoginStatus;
