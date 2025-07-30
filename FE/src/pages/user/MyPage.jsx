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

  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      if (!auth) {
        alert("로그인 해주세요.");
        navigate("/login");
        return;
      }
      console.log("auth.userId:", auth.userId);
      try {
        let response;
        let data;
        if (auth.oauthSelect == 1) {
          // 소셜 로그인 계정이면 /mypage 요청
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
        } catch (e) {
          console.error("유저 정보 불러오기 실패", e);
        }
      };
      getUser();
    }, [auth]);

  const handleModify = () => {
    setIsEditable((prev) => !prev); // 토글
  };

  const handleWithdraw = () => {
    // if (window.confirm("정말 탈퇴하시겠습니까?")) {
    //   alert("회원탈퇴가 완료되었습니다.");
    //   // 탈퇴 API 호출 및 후처리 필요시 여기에 추가
    // }
  };

  if (!userData) return <div>로딩중...</div>;

  return (
    <div className="page-wrapper">
      <MyPageAside />

      <section className="page-content">
        <h2>내 정보 관리</h2>
        <div className="info-grid">
          <div className="form-field">
            <label>닉네임</label>
            <input type="text" value={userData.nickname || ""} readOnly={!isEditable} />
          </div>

          <div className="form-field">
            <label>예약자 이름</label>
            <input
              type="text"
              value={name}
              placeholder="미입력 (앱에서 입력해 주세요.)"
              onChange={(e) => setName(e.target.value)}
              readOnly={!isEditable}
            />
          </div>

          <div className="form-field">
            <label>휴대폰 번호</label>
            <input type="text" value="01024354661" readOnly={!isEditable}/>
          </div>

          <div className="form-field">
            <label>생년월일</label>
            <input type="text" value="2001년 10월 25일" readOnly={!isEditable} />
          </div>

          <div className="form-field full">
            <label>이메일</label>
            <input
              type="text"
              value={
                userData.email
                  ? userData.provider
                    ? `${userData.email} (${userData.provider})`
                    : userData.email
                  : ""
              }
              readOnly
            />
          </div>
        </div>

        <div className="device-section">
          <button className="logout-btn" onClick={handleModify}>
            {isEditable ? "되돌아가기" : "수정모드"}
          </button>
        </div>
        
        {isEditable ? 
          <div className="device-section">
            <button className="logout-btn" onClick={handleModify}>
              수정완료
            </button>
          </div> 
        : null }

        <div className="withdraw-section">
          <p>더 이상 온쉼 이용을 원하지 않으신가요?</p>
          <button className="withdraw-btn" onClick={handleWithdraw}>
            회원탈퇴
          </button>
        </div>
      </section>
    </div>
  );
};

export default MyPage;
