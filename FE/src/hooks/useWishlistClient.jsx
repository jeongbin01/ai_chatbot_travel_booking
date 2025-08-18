// src/hooks/useWishlistClient.jsx
import { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/** 사용자별 wishlist key */
const getWishlistKey = (userId) => `wishlist_${userId ?? "guest"}`;
/** 전역 변경 이벤트 이름 */
const WISHLIST_EVENT = "wishlist:changed";
/** 빈 캐치용 no-op (ESLint no-empty 회피) */
const noop = () => {};

export default function useWishlistClient() {
  const { auth } = useContext(AuthContext); // { userId, ... }
  const navigate = useNavigate();
  const location = useLocation();

  const userId = auth?.userId ?? null;
  const isLoggedIn = !!userId;

  // [{ id, name, image, location, price }]
  const [items, setItems] = useState([]);

  /** 전역 이벤트 브로드캐스트 */
  const dispatchWishlistEvent = useCallback((detail) => {
    try {
      window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail }));
    } catch (e) {
      noop(e);
    }
  }, []);

  /** 로컬스토리지 읽기 */
  const readLS = useCallback(() => {
    if (!isLoggedIn) return [];
    try {
      const raw = localStorage.getItem(getWishlistKey(userId));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      // 파싱 실패 시 안전하게 초기화
      noop(e);
      return [];
    }
  }, [isLoggedIn, userId]);

  /** 로컬스토리지 쓰기 */
  const writeLS = useCallback(
    (arr) => {
      if (!isLoggedIn) return;
      try {
        localStorage.setItem(getWishlistKey(userId), JSON.stringify(arr));
        dispatchWishlistEvent({ userId, count: arr.length, action: "write" });
      } catch (e) {
        noop(e);
      }
    },
    [isLoggedIn, userId, dispatchWishlistEvent]
  );

  /** 초기 로드 & 사용자 변경 시 로드 */
  useEffect(() => {
    setItems(readLS());
  }, [readLS]);

  /** 다른 탭/창에서 변경 감지 */
  useEffect(() => {
    const onStorage = (e) => {
      // e.key === null 은 clear() 같은 전체 변경
      if (e.key === null || e.key === getWishlistKey(userId)) {
        setItems(readLS());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [readLS, userId]);

  /** 같은 탭 내 다른 컴포넌트 변경 감지 */
  useEffect(() => {
    const onChanged = (e) => {
      if (e.detail?.userId === userId) {
        setItems(readLS());
      }
    };
    window.addEventListener(WISHLIST_EVENT, onChanged);
    return () => window.removeEventListener(WISHLIST_EVENT, onChanged);
  }, [readLS, userId]);

  /** 로그인 유도 */
  const requireLogin = useCallback(() => {
    alert("찜은 로그인 후 이용 가능합니다.");
    navigate("/login", {
      state: { from: location.pathname + location.search },
      replace: true,
    });
  }, [navigate, location]);

  /** id가 찜인지 여부 */
  const isWished = useCallback(
    (id) => items.some((it) => Number(it.id) === Number(id)),
    [items]
  );

  /**
   * 찜 토글
   * @param {object|number|string} itemOrId - 전체 객체(권장) 또는 id
   * @param {object} meta - id만 줄 때 보조 메타({name,image,location,price})
   */
  const toggleWish = useCallback(
    (itemOrId, meta = {}) => {
      if (!isLoggedIn) return requireLogin();

      const base = typeof itemOrId === "object" ? itemOrId : { id: itemOrId, ...meta };
      const idNum = Number(base.id);
      if (!idNum || Number.isNaN(idNum)) return;

      const normalized = {
        id: idNum,
        name: base.name ?? "",
        image: base.image ?? base.thumbnailUrl ?? base.images?.[0] ?? "",
        location: base.location ?? base.address ?? "",
        price: Number(base.price ?? base.minPrice ?? 0) || 0,
      };

      setItems((prev) => {
        const exists = prev.some((x) => Number(x.id) === idNum);
        const next = exists
          ? prev.filter((x) => Number(x.id) !== idNum)
          : [...prev, normalized];

        writeLS(next);
        dispatchWishlistEvent({
          userId,
          count: next.length,
          action: exists ? "removed" : "added",
          item: normalized,
        });

        return next;
      });
    },
    [isLoggedIn, requireLogin, writeLS, dispatchWishlistEvent, userId]
  );

  /** 특정 id 제거 */
  const removeWish = useCallback(
    (id) => {
      const idNum = Number(id);
      setItems((prev) => {
        const item = prev.find((x) => Number(x.id) === idNum);
        const next = prev.filter((x) => Number(x.id) !== idNum);
        writeLS(next);
        dispatchWishlistEvent({ userId, count: next.length, action: "removed", item });
        return next;
      });
    },
    [writeLS, dispatchWishlistEvent, userId]
  );

  /** 전체 비우기 */
  const clearWishes = useCallback(() => {
    writeLS([]);
    setItems([]);
    dispatchWishlistEvent({ userId, count: 0, action: "cleared" });
  }, [writeLS, dispatchWishlistEvent, userId]);

  return { isLoggedIn, items, isWished, toggleWish, removeWish, clearWishes };
}
