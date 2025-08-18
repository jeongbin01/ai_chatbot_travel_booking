// Favorites.jsx
import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import MyPageAside from "./MyPageAside";
import "../../styles/utils/Favorites.css";
import "../../styles/utils/MyPageLayout.css";

import useWishlistClient from "../../hooks/useWishlistClient";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const isDev =
  (typeof import.meta !== "undefined" && import.meta.env && !!import.meta.env.DEV) ||
  (typeof globalThis !== "undefined" &&
    globalThis.process &&
    globalThis.process.env &&
    globalThis.process.env.NODE_ENV !== "production");

const getFolderKey = (userId) => `favoriteFolders:${userId ?? "guest"}`;

const Favorites = () => {
  const { auth } = useContext(AuthContext);
  const userId = auth?.userId;
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 가드
  useEffect(() => {
    if (!userId) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login", { state: { from: location.pathname + location.search } });
    }
  }, [userId, navigate, location]);

  // 찜 데이터
  const { items: wishedItems } = useWishlistClient();

  // 폴더 상태
  const [folders, setFolders] = useState([]); // [{ id, name, itemIds:number[] }]
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [addTargets, setAddTargets] = useState({}); // { [itemId]: folderId }

  // 로컬스토리지 I/O
  const readFolders = useCallback(() => {
    try {
      const raw = localStorage.getItem(getFolderKey(userId));
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      if (isDev) console.error("[Favorites] readFolders failed:", e);
      return [];
    }
  }, [userId]);

  const writeFolders = useCallback(
    (arr) => {
      try {
        localStorage.setItem(getFolderKey(userId), JSON.stringify(arr));
      } catch (e) {
        if (isDev) console.error("[Favorites] writeFolders failed:", e);
      }
    },
    [userId]
  );

  // 초기 로드
  useEffect(() => {
    setFolders(readFolders());
  }, [readFolders]);

  // 계산 값들
  const assignedIdSet = useMemo(() => {
    const s = new Set();
    folders.forEach((f) => (f.itemIds || []).forEach((id) => s.add(Number(id))));
    return s;
  }, [folders]);

  const sortedWished = useMemo(
    () => [...wishedItems].sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    [wishedItems]
  );

  const unassignedItems = useMemo(
    () => sortedWished.filter((it) => !assignedIdSet.has(Number(it.id))),
    [sortedWished, assignedIdSet]
  );

  const hasFolders = folders.length > 0;

  // 액션
  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    // 중복 폴더명 방지
    if (folders.some((f) => f.name === name)) {
      alert("같은 이름의 폴더가 있습니다.");
      return;
    }
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
    let tmp = folders.map((f) =>
      Number(f.id) === Number(fromFolderId)
        ? { ...f, itemIds: (f.itemIds || []).filter((id) => Number(id) !== Number(itemId)) }
        : f
    );
    tmp = tmp.map((f) =>
      Number(f.id) === Number(toFolderId)
        ? { ...f, itemIds: Array.from(new Set([...(f.itemIds || []), Number(itemId)])) }
        : f
    );
    setFolders(tmp);
    writeFolders(tmp);
  };

  const deleteFolder = (folderId) => {
    const target = folders.find((f) => Number(f.id) === Number(folderId));
    if (!target) return;
    if (!window.confirm(`‘${target.name}’ 폴더를 삭제할까요? (폴더만 삭제, 찜은 유지)`)) return;
    const next = folders.filter((f) => Number(f.id) !== Number(folderId));
    setFolders(next);
    writeFolders(next);
  };

  // 렌더 helpers
  const FolderCard = ({ folder }) => {
    const folderItems = (folder.itemIds || [])
      .map((id) => sortedWished.find((it) => Number(it.id) === Number(id)))
      .filter(Boolean);

    return (
      <div className="fav-folder">
        <div className="fav-folder__header">
          <div className="fav-folder__title">
            <span className="dot" />
            <strong>{folder.name}</strong>
            <span className="badge">{folderItems.length}개</span>
          </div>
          <div className="fav-folder__actions">
            <button className="btn-outline" onClick={() => deleteFolder(folder.id)}>
              폴더 삭제
            </button>
          </div>
        </div>

        {folderItems.length === 0 ? (
          <div className="fav-empty">이 폴더에는 아직 아이템이 없습니다.</div>
        ) : (
          <div className="fav-grid">
            {folderItems.map((item) => (
              <div className="fav-card" key={item.id}>
                <img
                  src={item.image || "/images/no-image.png"}
                  alt={item.name}
                  onError={(e) => (e.currentTarget.src = "/images/no-image.png")}
                />
                <div className="fav-card__body">
                  <p className="fav-title">{item.name}</p>
                  <p className="fav-loc">{item.location}</p>
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
                      className="btn-danger"
                      onClick={() => removeItemFromFolder(folder.id, item.id)}
                    >
                      폴더에서 제거
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const UnassignedSection = () => (
    <div className="fav-section">
      <div className="fav-section__header">
        <div className="title">
          <strong>미분류</strong>
          <span className="badge">{unassignedItems.length}개</span>
        </div>
      </div>

      {unassignedItems.length === 0 ? (
        <div className="fav-empty">미분류 항목이 없습니다.</div>
      ) : (
        <div className="fav-grid">
          {unassignedItems.map((item) => (
            <div className="fav-card" key={item.id}>
              <img
                src={item.image || "/images/no-image.png"}
                alt={item.name}
                onError={(e) => (e.currentTarget.src = "/images/no-image.png")}
              />
              <div className="fav-card__body">
                <p className="fav-title">{item.name}</p>
                <p className="fav-loc">{item.location}</p>
                <div className="fav-actions">
                  <select
                    value={addTargets[item.id] || ""}
                    onChange={(e) =>
                      setAddTargets((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    disabled={!hasFolders}
                  >
                    <option value="">{hasFolders ? "폴더 선택" : "먼저 폴더 생성"}</option>
                    {folders.map((f) => (
                      <option value={f.id} key={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn-primary"
                    disabled={!hasFolders || !addTargets[item.id]}
                    onClick={() => addItemToFolder(item.id)}
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // UI
  return (
    <div className="favorites-container">
      <MyPageAside />

      <section className="favorites-content">
        <div className="favorites-header">
          <div>
            <h2>찜 목록</h2>
            <p className="sub">
              전체 <b>{wishedItems.length}</b>개 &nbsp;|&nbsp; 미분류 <b>{unassignedItems.length}</b>개
            </p>
          </div>
          <button className="favorites-new-folder-btn" onClick={() => setShowModal(true)}>
            + 새 폴더
          </button>
        </div>

        {/* 폴더 섹션 */}
        {hasFolders ? (
          folders.map((f) => <FolderCard key={f.id} folder={f} />)
        ) : (
          <div className="empty-box">
            <p className="empty-title">아직 생성된 폴더가 없습니다</p>
            <p className="empty-sub">우측 상단의 <b>+ 새 폴더</b> 버튼으로 만들어보세요!</p>
          </div>
        )}

        {/* 미분류 섹션 */}
        <UnassignedSection />
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
              <button className="btn-primary" onClick={handleCreateFolder}>생성</button>
              <button className="btn-outline" onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
