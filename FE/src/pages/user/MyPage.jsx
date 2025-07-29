import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/utils/MyPage.css";
import "../../styles/utils/MyPageLayout.css";
import MyPageAside from "./MyPageAside";

const MyPage = () => {
  const navigate = useNavigate();

  // 초기 상태 (비회원용 더미 데이터)
  const [nickname, setNickname] = useState("게스트");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleUpdate = () => {
    if (!name || !phone) {
      alert("이름과 전화번호를 입력해 주세요.");
      return;
    }

    alert("비회원 정보가 임시 저장되었습니다.");
    setIsSaved(true);
  };

  const handleLogoutAll = () => {
    if (window.confirm("정말 모든 기기에서 로그아웃하시겠습니까?")) {
      alert("전체 로그아웃 되었습니다. (모의 동작)");
    }
  };

  const handleWithdraw = () => {
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      alert("회원탈퇴가 완료되었습니다. (모의 동작)");
      navigate("/");
    }
  };

  const displayEmail = "guest@example.com (비회원)";

  return (
    <div className="page-wrapper">
      <MyPageAside />
      <section className="page-content">
        <h2>내 정보 관리</h2>
        <div className="info-notice">
          현재 정보 수정이 <strong>가능</strong>합니다.
        </div>

        <div className="info-grid">
          <div className="form-field">
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsSaved(false);
              }}
              placeholder="닉네임을 입력해 주세요."
            />
          </div>

          <div className="form-field">
            <label>예약자 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsSaved(false);
              }}
              placeholder="이름을 입력해 주세요."
            />
          </div>

          <div className="form-field">
            <label>휴대폰 번호</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setIsSaved(false);
              }}
              placeholder="010-1234-5678"
            />
          </div>

          <div className="form-field">
            <label>생년월일</label>
            <input
              type="date"
              value={birth}
              onChange={(e) => {
                setBirth(e.target.value);
                setIsSaved(false);
              }}
            />
          </div>

          <div className="form-field">
            <label>이메일</label>
            <input type="email" value={displayEmail} readOnly />
          </div>

          <div className="form-field full">
            <label>성별</label>
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setIsSaved(false);
              }}
            >
              <option value="">선택</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>
        </div>

        <div className="device-section">
          <button className="logout-btn" onClick={handleUpdate}>
            {isSaved ? "수정 완료됨" : "저장하기"}
          </button>
        </div>

        <div className="withdraw-section">
          <p>더 이상 온쉼 이용을 원하지 않으신가요?</p>
          <button className="withdraw-btn" onClick={handleWithdraw}>
            회원탈퇴
          </button>
          <button className="logout-btn" onClick={handleLogoutAll}>
            모든 기기 로그아웃
          </button>
        </div>
      </section>
    </div>
  );
};

export default MyPage;
