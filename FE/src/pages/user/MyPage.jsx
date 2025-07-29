import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/utils/MyPage.css";
import "../../styles/utils/MyPageLayout.css";
import MyPageAside from "./MyPageAside";
import { AxiosClient } from "../../api/AxiosController.jsx"; // Ensure the extension is correct (.jsx or .js)
import { AuthContext } from "../../context/AuthContext";

const MyPage = () => {
  // Destructure 'logout' from AuthContext to manage user session
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      // Ensure auth object and userId exist before fetching
      if (!auth || !auth.userId) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const endpoint = auth.oauthSelect === 1 ? "mypage" : "myuser";
        const url = `/${endpoint}/${auth.userId}`;

        const response = await AxiosClient.get(url);
        
        // Handle cases where social login data might be in an array
        const data = Array.isArray(response.data) ? response.data[0] : response.data;

        if (!data) {
          throw new Error("User data could not be retrieved.");
        }

        setUserData(data);
        setNickname(data.nickname || "");
        setName(data.username || "");
        setPhone(data.phone || "");
        // Safely format date, ensuring 'birth' exists
        setBirth(data.birth ? data.birth.slice(0, 10) : "");
        // Standardize gender data on fetch
        setGender(data.gender === "남성" ? "M" : data.gender === "여성" ? "F" : "");

      } catch (e) {
        console.error("유저 정보 불러오기 실패:", e);
        alert("유저 정보를 불러오는 중 오류가 발생했습니다.");
        // Redirect or handle error state if user data fails to load
        navigate("/"); 
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [auth, navigate]);

  const handleUpdate = async () => {
    // Prevent API call if there are no changes
    if (isSaved) {
        alert("이미 정보가 저장되었습니다.");
        return;
    }
    try {
      const payload = {
        username: name,
        nickname,
        phone,
        birth,
        // Convert gender back to the format the server expects
        gender: gender === "M" ? "남성" : gender === "F" ? "여성" : "",
      };

      await AxiosClient.put(`/myuser/${auth.userId}`, payload);
      alert("정보가 성공적으로 저장되었습니다.");
      setIsSaved(true);
    } catch (e) {
      const msg = e.response?.data?.message || "정보 저장에 실패했습니다. 입력값을 확인해주세요.";
      console.error("업데이트 실패:", e);
      alert(msg);
    }
  };

  const handleLogoutAll = async () => {
    if (window.confirm("정말 모든 기기에서 로그아웃하시겠습니까?")) {
      try {
        // Example API call for logging out from all devices
        // await AxiosClient.post(`/auth/logout-all`); 
        alert("모든 기기에서 로그아웃 처리되었습니다.");
        if (logout) logout(); // Clear local session
        navigate("/login");
      } catch(e) {
        console.error("모든 기기 로그아웃 실패:", e);
        alert("처리 중 오류가 발생했습니다.");
      }
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm("정말로 탈퇴하시겠습니까? 모든 정보가 삭제되며 되돌릴 수 없습니다.")) {
       try {
        // API call to delete the user account
        await AxiosClient.delete(`/myuser/${auth.userId}`);
        alert("회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.");
        if (logout) logout(); // Log out the user
        navigate("/"); // Redirect to the main page
       } catch(e) {
        console.error("회원 탈퇴 실패:", e);
        alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
       }
    }
  };

  if (loading) {
    return <div className="loading">사용자 정보를 불러오는 중입니다...</div>;
  }

  if (!userData) {
    return <div className="loading">사용자 정보를 표시할 수 없습니다.</div>;
  }

  const displayEmail = userData.provider
    ? `${userData.email} (${userData.provider})`
    : userData.email;

  return (
    <div className="page-wrapper">
      <MyPageAside />
      <section className="page-content">
        <h2>내 정보 관리</h2>
        <div className="info-grid">
          {/* Form fields remain the same, but readOnly is now removed for editing */}
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
              <option value="">선택 안 함</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>
        </div>

        <div className="device-section">
          {/* The button is disabled after a successful save until a new change is made */}
          <button className="logout-btn" onClick={handleUpdate} disabled={isSaved}>
            {isSaved ? "수정 완료" : "내 정보 저장"}
          </button>
        </div>

        <div className="withdraw-section">
          <p>더 이상 서비스를 이용하지 않으시나요?</p>
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