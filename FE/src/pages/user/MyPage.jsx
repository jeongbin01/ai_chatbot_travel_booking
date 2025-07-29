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
    phone: "",
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

      // 1-1) 로컬 스토리지 우선
      const saved = localStorage.getItem(STORAGE_KEY(auth.userId));
      if (saved) {
        setUserInfo(JSON.parse(saved));
        setIsLoading(false);
        return;
      }

      // 1-2) 로컬에 없으면 (나중에 API 연결시 사용)
      try {
        const res = await AxiosClient.get(`/mypage/${auth.userId}`);
        setUserInfo(res.data);
      } catch {
        console.warn("API 미연결 상태, 로컬 초기값 사용");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [auth, navigate]);

  // 2) 입력 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((p) => ({ ...p, [name]: value }));
  };

  // 3) 수정 저장 → 로컬 스토리지에 저장
  const handleUpdate = () => {
    if (!window.confirm("수정된 정보를 저장하시겠습니까?")) return;
    localStorage.setItem(STORAGE_KEY(auth.userId), JSON.stringify(userInfo));
    alert("정보가 저장되었습니다. (로컬)");
  };

  // 4) 전체 로그아웃 → 로컬 토큰·유저정보 지우고 로그인 페이지로
  const handleLogoutAll = () => {
    if (!window.confirm("모든 기기에서 로그아웃하시겠습니까?")) return;
    //  실제 API: await AxiosClient.post("/auth/logout-all");
    localStorage.removeItem(STORAGE_KEY(auth.userId));
    setAuth(null);
    navigate("/login");
  };

  // 5) 회원 탈퇴 → 로컬 데이터 전부 삭제, 회원가입 페이지로
  const handleWithdraw = () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) return;
    // 실제 API: await AxiosClient.delete(`/users/${auth.userId}`);
    localStorage.removeItem(STORAGE_KEY(auth.userId));
    setAuth(null);
    navigate("/register");
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
              value={userInfo.nickname}
              onChange={handleChange}
              placeholder="닉네임 입력"
            />
          </div>

          {/* 예약자 이름 */}
          <div className="form-field">
            <label>예약자 이름</label>
            <input name="name" value={userInfo.name} readOnly />
          </div>

          {/* 휴대폰 번호 */}
          <div className="form-field">
            <label>휴대폰 번호</label>
            <input
              name="phone"
              value={userInfo.phone}
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
              value={userInfo.birthdate}
              onChange={handleChange}
            />
          </div>

          {/* 이메일 */}
          <div className="form-field">
            <label>이메일</label>
            <input name="email" value={userInfo.email} readOnly />
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
