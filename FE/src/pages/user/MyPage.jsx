import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/utils/MyPage.css";
import "../../styles/utils/MyPageLayout.css";
import MyPageAside from "./MyPageAside"; 
import { AxiosClient } from "../../api/AxiosController.jsx";
import { AuthContext } from "../../context/AuthContext";

const MyPage = () => {
  const { auth } = useContext(AuthContext); 
  const navigate = useNavigate();
  
  useEffect(() => {
    const getUser = async () => {
      if (auth){
        try {
          console.log(auth.userId)
          const userData = await AxiosClient("mypage").getById(auth.userId);
          console.log("userData:", userData);
        } catch (e) {
          console.error("유저 정보 불러오기 실패", e);
        }
      }
      else {
        alert("로그인 해주세요.")
        navigate("/login")
      }
    };

    getUser();
  }, []);

  const [name, setName] = useState("");

  const handleLogoutAll = () => {
    if (window.confirm("정말 모든 기기에서 로그아웃하시겠습니까?")) {
      alert("전체 로그아웃 되었습니다.");
    }
  };

  const handleWithdraw = () => {
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      alert("회원탈퇴가 완료되었습니다.");
    }
  };

  return (
    <div className="page-wrapper">
      {/* === 좌측 사이드바 메뉴 === */}
      <MyPageAside/>

      {/* === 우측 콘텐츠 === */}
      <section className="page-content">
        <h2>내 정보 관리</h2>

        <div className="info-notice">
          현재 정보 수정은 <strong>OnComma</strong>에서 가능해요.
        </div>

        {/* 회원 정보 입력 폼 */}
        <div className="info-grid">
          <div className="form-field">
            <label>닉네임</label>
            <input type="text" value="민초어떄" readOnly />
          </div>

          <div className="form-field">
            <label>예약자 이름</label>
            <input
              type="text"
              value={name}
              placeholder="미입력 (앱에서 입력해 주세요.)"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>휴대폰 번호</label>
            <input type="text" value="01024354661" readOnly />
          </div>

          <div className="form-field">
            <label>생년월일</label>
            <input type="text" value="2001년 10월 25일" readOnly />
          </div>

          <div className="form-field full">
            <label>성별</label>
            <input type="text" value="남성" readOnly />
          </div>
        </div>

        {/* 기기 관리 */}
        <div className="device-section">
          <button className="logout-btn" onClick={handleLogoutAll}>
            수정하기
          </button>
        </div>

        {/* 회원탈퇴 */}
        <div className="withdraw-section">
          <p>더 이상 여기어때 이용을 원하지 않으신가요?</p>
          <button className="withdraw-btn" onClick={handleWithdraw}>
            회원탈퇴
          </button>
        </div>
      </section>
    </div>
  );
};

export default MyPage;