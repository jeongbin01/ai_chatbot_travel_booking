import React, { useEffect, useState } from "react";
const LS_KEY = "act_favorites_v1";

const ActFavoriteButton = ({ id, label = "찜" }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      setLiked(new Set(arr).has(id));
    } catch (err) {
      console.error("즐겨찾기 로드 실패:", err);
    }
  }, [id]);

  const persist = (next) => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const set = new Set(raw ? JSON.parse(raw) : []);
      if (next) set.add(id); else set.delete(id);
      localStorage.setItem(LS_KEY, JSON.stringify([...set]));
    } catch (err) {
      console.error("즐겨찾기 저장 실패:", err);
    }
  };

  const toggle = () => {
    setLiked(prev => {
      const next = !prev;
      persist(next);
      return next;
    });
  };

  return (
    <button
      aria-pressed={liked}
      onClick={toggle}
      className={`act-fav ${liked ? "is-liked" : ""}`}
      title={liked ? "찜 해제" : "찜하기"}
    >
      {liked ? "❤️ " : "🤍 "} {label}
    </button>
  );
};

export default ActFavoriteButton;
