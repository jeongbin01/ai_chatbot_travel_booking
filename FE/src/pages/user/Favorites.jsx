import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// axios를 쓸 경우 주석 해제하고 경로 조정하세요.
// import axios from "axios";

import "../../styles/utils/Favorites.css";
import "../../styles/utils/MyPageLayout.css";

const Favorites = () => {
  const location = useLocation();
  const [folders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // 예시: API에서 폴더 불러오기
  useEffect(() => {
    // const fetchFavorites = async () => {
    //   try {
    //     const res = await axios.get("/api/favorites");
    //     setFolders(res.data);
    //   } catch (err) {
    //     console.error("찜 목록 불러오기 실패", err);
    //   }
    // };
    // fetchFavorites();
  }, []);

  const handleCreateFolder = async () => {
    // try {
    //   await axios.post("/api/favorites/folders", { name: newFolderName });
    //   setShowModal(false);
    //   setNewFolderName("");
    //   // 재요청
    //   fetchFavorites();
    // } catch (err) {
    //   console.error("폴더 생성 실패", err);
    // }
  };

  return (
    <div className="favorites-container">
      {/* 사이드바 */}
      <aside className="favorites-sidebar">
        <ul>
          <li className={location.pathname === "/mypage/bookings" ? "active" : ""}>
            <Link to="/mypage/bookings">예약 내역</Link>
          </li>
          <li className={location.pathname === "/mypage/wishlist" ? "active" : ""}>
            <Link to="/mypage/wishlist">찜 목록</Link>
          </li>
          <li className={location.pathname === "/mypage/profile" ? "active" : ""}>
            <Link to="/mypage/profile">내 정보 관리</Link>
          </li>
        </ul>
      </aside>

      {/* 콘텐츠 */}
      <section className="favorites-content">
        <div className="favorites-header">
          <h2>찜 목록</h2>
          <button
            className="favorites-new-folder-btn"
            onClick={() => setShowModal(true)}
          >
            + 새 폴더
          </button>
        </div>

        {/* 빈 상태 */}
        {folders.length === 0 ? (
          <div className="empty-box">
            <p className="empty-title">아직 생성된 폴더가 없습니다</p>
            <p className="empty-sub">새 폴더를 만들어보세요!</p>
          </div>
        ) : (
          folders.map((folder) => (
            <div className="favorites-folder" key={folder.id}>
              <div className="favorites-folder-info">
                <strong>{folder.name}</strong>
                <p>숙소 {folder.accommodations.length}개</p>
              </div>
              <div className="favorites-accommodation-list">
                {folder.accommodations.map((item) => (
                  <div
                    key={item.id}
                    className="favorites-accommodation-card"
                  >
                    <img src={item.thumbnail} alt={item.title} />
                    <p>{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* 새 폴더 모달 */}
      {showModal && (
        <div className="favorites-modal-overlay">
          <div className="favorites-modal">
            <h3>새 폴더 만들기</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="폴더 이름 입력"
            />
            <div className="modal-buttons">
              <button onClick={handleCreateFolder}>생성</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
