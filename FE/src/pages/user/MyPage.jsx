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
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  console.log("auth.userId :::::" + auth.userId);

  useEffect(() => {
    const getUser = async () => {
      if (!auth) {
        alert("로그인 해주세요.");
        navigate("/login");
        return;
      }
      console.log("auth.userId : - ", auth.userId);
      try {
        let response;
        let data;
        if (auth.oauthSelect == 1) {
          // 소셜 로그인 계정이면 /mypage 요청
          response = await AxiosClient("mypage").getById(auth.userId);
          data = response.data[0];
          setUserData(data);
        } else {
          if (auth.oauthSelect == 0) {
            // 일반 계정이면 /MyUser 요청
            response = await AxiosClient("myuser").getById(auth.userId);
            data = response.data;
            setUserData(data);
          }
        }
      } catch (e) {
        console.error("유저 정보 불러오기 실패", e);
      }
    };
    getUser();
  }, [auth, navigate]);

  useEffect(() => {
    if (userData) {
      setNickname(userData.nickname || "");
      setPhoneNumber(userData.phoneNumber || "");
    }
  }, [userData]);

  // 휴대폰 번호 자동 하이픈 함수
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 3 && value.length <= 7) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    setPhoneNumber(value);
  };

  const handleModify = async (nickname, phoneNumber) => {
    try {
      const updatedUserData = {
        ...userData,
        nickname,
        phoneNumber,
      };

      if (auth && auth.oauthSelect == 1) {
        await AxiosClient("mypage/user", auth.token).update(auth.userId, updatedUserData);
      } else if (auth && auth.oauthSelect == 0) {
        await AxiosClient("myuser", auth.token).update(auth.userId, updatedUserData);
      }
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
    }
  };

  const handleWithdraw = () => {
    // 회원탈퇴 로직
  };

  if (!userData) return <div>로딩중...</div>;

  return (
    <div className="page-wrapper">
      <MyPageAside />
      <section className="page-content">
        <h2>내 정보 관리</h2>
        <div className="info-grid">
          <div className="form-field">
            <label>아이디</label>
            <input type="text" value={userData.username} readOnly />
          </div>
          <div className="form-field">
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              readOnly={!isEditable}
            />
          </div>
          <div className="form-field">
            <label>생성날짜</label>
            <input type="text" value={userData.registrationDate.split("T")[0]} readOnly />
          </div>
          <div className="form-field">
            <label>휴대폰 번호</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneChange}
              readOnly={!isEditable}
            />
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
          <button
            className="logout-btn"
            onClick={() => {
              if (isEditable) {
                setNickname(userData.nickname || "");
                setPhoneNumber(userData.phoneNumber || "");
                setIsEditable(false);
              } else {
                setIsEditable(true);
              }
            }}
          >
            {isEditable ? "되돌아가기" : "수정모드"}
          </button>
          {isEditable && (
            <button
              className="logout-btn"
              onClick={() => {
                handleModify(nickname, phoneNumber);
                setIsEditable(false);
              }}
            >
              수정완료
            </button>
          )}
        </div>
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
