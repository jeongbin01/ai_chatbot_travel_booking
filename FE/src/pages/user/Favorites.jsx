import React, { useState, useEffect } from "react";
import MyPageAside from "./MyPageAside"; 
import "../../styles/utils/Favorites.css";
import "../../styles/utils/MyPageLayout.css";

// ===== 추가 import (위 4줄은 그대로 두고, 아래만 추가) =====
import { useContext, useMemo, useCallback } from "react";
import useWishlistClient from "../../hooks/useWishlistClient";
import { AuthContext } from "../../context/AuthContext";

// 사용자별 폴더 저장 키
const getFolderKey = (userId) => `favoriteFolders:${userId ?? "guest"}`;

const Favorites = () => {
  const { auth } = useContext(AuthContext);
  const userId = auth?.userId;

  // 찜 데이터 (useWishlistClient에서 가져옴)
  const { items: wishedItems } = useWishlistClient({
    fallbackImage: "/images/no-image.png",
  });

  // 폴더: [{ id, name, itemIds: number[] }]
  const [folders, setFolders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // 미분류 → 폴더 추가용 선택 상태: { [itemId]: folderId }
  const [addTargets, setAddTargets] = useState({});

  // ===== 로컬 스토리지 helper (API 전 단계) =====
  const readFolders = useCallback(() => {
    try {
      const raw = localStorage.getItem(getFolderKey(userId));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [userId]);

  const writeFolders = useCallback(
    (arr) => {
      try {
        localStorage.setItem(getFolderKey(userId), JSON.stringify(arr));
      } catch {
        // ignore
      }
    },
    [userId]
  );

  // 초기 로드
  useEffect(() => {
    setFolders(readFolders());
  }, [readFolders]);

  // 폴더에 이미 담긴 itemIds 집합
  const assignedIdSet = useMemo(() => {
    const s = new Set();
    folders.forEach((f) => (f.itemIds || []).forEach((id) => s.add(Number(id))));
    return s;
  }, [folders]);

  // 미분류: 폴더에 없는 찜 아이템
  const unassignedItems = useMemo(
    () => wishedItems.filter((it) => !assignedIdSet.has(Number(it.id))),
    [wishedItems, assignedIdSet]
  );

  // ===== 액션 =====
  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const next = [...folders, { id: Date.now(), name, itemIds: [] }];
    setFolders(next);
    writeFolders(next);
    setShowModal(false);
    setNewFolderName("");
  };

  const addItemToFolder = (itemId) => {
    const folderId = Number(addTargets[itemId]);
    if (!folderId) return;
    const next = folders.map((f) =>
      Number(f.id) === folderId
        ? { ...f, itemIds: Array.from(new Set([...(f.itemIds || []), Number(itemId)])) }
        : f
    );
    setFolders(next);
    writeFolders(next);
    setAddTargets((prev) => ({ ...prev, [itemId]: "" }));
  };

  const removeItemFromFolder = (folderId, itemId) => {
    const next = folders.map((f) =>
      Number(f.id) === Number(folderId)
        ? { ...f, itemIds: (f.itemIds || []).filter((id) => Number(id) !== Number(itemId)) }
        : f
    );
    setFolders(next);
    writeFolders(next);
  };

  const moveItemToAnotherFolder = (fromFolderId, itemId, toFolderId) => {
    if (!toFolderId || Number(fromFolderId) === Number(toFolderId)) return;
    // 먼저 from에서 제거
    let tmp = folders.map((f) =>
      Number(f.id) === Number(fromFolderId)
        ? { ...f, itemIds: (f.itemIds || []).filter((id) => Number(id) !== Number(itemId)) }
        : f
    );
    // to에 추가
    tmp = tmp.map((f) =>
      Number(f.id) === Number(toFolderId)
        ? { ...f, itemIds: Array.from(new Set([...(f.itemIds || []), Number(itemId)])) }
        : f
    );
    setFolders(tmp);
    writeFolders(tmp);
  };

  const deleteFolder = (folderId) => {
    const next = folders.filter((f) => Number(f.id) !== Number(folderId));
    setFolders(next);
    writeFolders(next);
  };

  // ===== 렌더링 보조 =====
  const renderUnassigned = () => (
    <div className="favorites-section">
      <div className="favorites-folder-header">
        <strong>미분류</strong>
        <span>숙소 {unassignedItems.length}개</span>
      </div>
      {unassignedItems.length === 0 ? (
        <p className="empty-sub">미분류 항목이 없습니다.</p>
      ) : (
        <div className="favorites-accommodation-list">
          {unassignedItems.map((item) => (
            <div className="favorites-accommodation-card" key={item.id}>
              <img
                src={item.image || "/images/no-image.png"}
                alt={item.name}
                onError={(e) => (e.currentTarget.src = "/images/no-image.png")}
              />
              <p className="fav-title">{item.name}</p>
              <p className="fav-loc">{item.location}</p>
              <div className="fav-actions">
                <select
                  value={addTargets[item.id] || ""}
                  onChange={(e) =>
                    setAddTargets((prev) => ({ ...prev, [item.id]: e.target.value }))
                  }
                >
                  <option value="">폴더 선택</option>
                  {folders.map((f) => (
                    <option value={f.id} key={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <button
                  className="fav-btn"
                  disabled={!addTargets[item.id]}
                  onClick={() => addItemToFolder(item.id)}
                >
                  추가
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFolder = (folder) => {
    const folderItems = (folder.itemIds || [])
      .map((id) => wishedItems.find((it) => Number(it.id) === Number(id)))
      .filter(Boolean);

    return (
      <div className="favorites-folder" key={folder.id}>
        <div className="favorites-folder-header">
          <strong>{folder.name}</strong>
          <div className="folder-actions">
            <span>숙소 {folderItems.length}개</span>
            <button className="outline" onClick={() => deleteFolder(folder.id)}>
              폴더 삭제
            </button>
          </div>
        </div>

        {folderItems.length === 0 ? (
          <p className="empty-sub">이 폴더에는 아직 아이템이 없습니다.</p>
        ) : (
          <div className="favorites-accommodation-list">
            {folderItems.map((item) => (
              <div className="favorites-accommodation-card" key={item.id}>
                <img
                  src={item.image || "/images/no-image.png"}
                  alt={item.name}
                  onError={(e) => (e.currentTarget.src = "/images/no-image.png")}
                />
                <p className="fav-title">{item.name}</p>
                <p className="fav-loc">{item.location}</p>

                {/* 폴더 간 이동 */}
                <div className="fav-actions">
                  <select
                    defaultValue=""
                    onChange={(e) =>
                      moveItemToAnotherFolder(folder.id, item.id, Number(e.target.value))
                    }
                  >
                    <option value="">다른 폴더로 이동</option>
                    {folders
                      .filter((f) => Number(f.id) !== Number(folder.id))
                      .map((f) => (
                        <option value={f.id} key={f.id}>
                          {f.name}
                        </option>
                      ))}
                  </select>
                  <button
                    className="danger"
                    onClick={() => removeItemFromFolder(folder.id, item.id)}
                  >
                    폴더에서 제거
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="favorites-container">
      {/* 사이드바 */}
      <MyPageAside />

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

        {/* 미분류 섹션 */}
        {renderUnassigned()}

        {/* 폴더 섹션 */}
        {folders.length === 0 ? (
          <div className="empty-box">
            <p className="empty-title">아직 생성된 폴더가 없습니다</p>
            <p className="empty-sub">+ 새 폴더 버튼으로 만들어보세요!</p>
          </div>
        ) : (
          folders.map(renderFolder)
        )}
      </section>

      {/* 새 폴더 모달 */}
      {showModal && (
        <div
          className="favorites-modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("favorites-modal-overlay")) {
              setShowModal(false);
            }
          }}
        >
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
