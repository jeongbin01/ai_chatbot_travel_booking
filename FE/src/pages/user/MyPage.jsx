import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/utils/MyPage.css";
import "../../styles/utils/MyPageLayout.css";
import MyPageAside from "./MyPageAside";
import { AxiosClient } from "../../api/AxiosController.jsx";
import { AuthContext } from "../../context/AuthContext";

const STORAGE_KEY = (userId) => `userInfo_${userId}`;

const MyPage = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    nickname: "",
    name: "",
    phone: "  ",
    birthdate: "",
    email: "",
    gender: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  // 1) 로컬스토리지나 API에서 불러오기
  useEffect(() => {
    const load = async () => {
      if (!auth?.userId) {
        alert("로그인이 필요합니다.");
        return navigate("/login");
      }
      try {
        let response;
        let data;
        if (auth.oauthSelect == 1) {
          response = await AxiosClient("mypage").getById(auth.userId);
          data = response.data[0];
          console.log(data)
          setUserData({
            email: data.email,
            nickname: data.nickname,
            provider: data.provider,
            socialAccountId: data.socialAccountId,
            userId: data.userId,
            userRole: data.userRole,
            username: data.username,
          });
          if (data.username) setName(data.username);
        } else {
          if (auth.oauthSelect == 0) {
          // 일반 계정이면 /MyUser 요청
            response = await AxiosClient("myuser").getById(auth.userId);
            data = response?.data;
            console.log(data)
            setUserData({
              email: data.email,
              nickname: data.nickname,
              userId: data.userId,
              userRole: data.userRole,
              username: data.username,
            });
            if (data.username) setName(data.username);
          }
        }
      } catch {
        console.warn("API 미연결 상태, 로컬 초기값 사용");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [auth, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((p) => ({ ...p, [name]: value }));
  };

  if (isLoading) return <div className="page-content">로딩 중...</div>;

  return (
    <div className="page-wrapper">
      <MyPageAside />
      <section className="page-content">
        <h2>내 정보 관리</h2>
        <div className="info-notice">
          (현재는 DB 대신 로컬에 저장됩니다)
        </div>

        <div className="info-grid">
          {/* 닉네임 */}
          <div className="form-field">
            <label>닉네임</label>
            <input
              name="nickname"
              value={userData.nickname}
              onChange={handleChange}
              placeholder="닉네임 입력"
            />
          </div>

          {/* 예약자 이름 */}
          <div className="form-field">
            <label>예약자 이름</label>
            <input name="name" value={userData.username} readOnly />
          </div>

          {/* 휴대폰 번호 */}
          <div className="form-field">
            <label>휴대폰 번호</label>
            <input
              name="phone"
              value="01012345678"
              onChange={handleChange}
              placeholder="01012345678"
            />
          </div>

          {/* 생년월일 */}
          <div className="form-field">
            <label>생년월일</label>
            <input
              type="date"
              name="birthdate"
              value="2015.08.15"
              onChange={handleChange}
            />
          </div>

          {/* 이메일 */}
          <div className="form-field">
            <label>이메일</label>
            <input name="email" 
            value={
              userData?.email
              ? userData.provider
                ? `${userData.email} (${userData.provider})`
                : userData.email
              : ""
            } 
            readOnly />
          </div>

          {/* 성별 (라디오 버튼으로 변경) */}
          <div className="form-field">
            <label>성별</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="남성"
                  checked={userInfo.gender === "남성"}
                  onChange={handleChange}
                />
                남성
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="여성"
                  checked={userInfo.gender === "여성"}
                  onChange={handleChange}
                />
                여성
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="기타"
                  checked={userInfo.gender === "기타"}
                  onChange={handleChange}
                />
                기타
              </label>
            </div>
          </div>
        </div>

        <div className="action-section">
          <button className="submit-btn" onClick={handleUpdate}>
            수정하기
          </button>
          <button className="logout-btn" onClick={handleLogoutAll}>
            전체 로그아웃
          </button>
        </div>

        <div className="withdraw-section">
          <p>더 이상 서비스 이용을 원하지 않으신가요?</p>
          <button className="withdraw-btn" onClick={handleWithdraw}>
            회원탈퇴
          </button>
        </div>
      </section>
    </div>
  );
};

export default MyPage;
