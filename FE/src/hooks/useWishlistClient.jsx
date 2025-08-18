import { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Helper to generate a unique wishlist key for each user
function getWishlistKey(userId) {
  return `wishlist_${userId}`;
}


export default function useWishlistClient() {
  const { auth } = useContext(AuthContext); // { userId, token ... }
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!auth?.userId;

  const [items, setItems] = useState([]); // [{id, name, image, location, price}, ...]

  // 로컬 읽기/쓰기
  const readLS = useCallback(() => {
    if (!isLoggedIn) return [];
    try {
      const raw = localStorage.getItem(getWishlistKey(auth.userId));
      return raw ? JSON.parse(raw) : [];
    } catch {
      // Failed to read from localStorage
      return [];
    }
  }, [isLoggedIn, auth?.userId]);

  const writeLS = useCallback(
    (arr) => {
      if (!isLoggedIn) return;
      try {
        localStorage.setItem(getWishlistKey(auth.userId), JSON.stringify(arr));
      } catch {
        // Failed to write to localStorage
      }
    },
    [isLoggedIn, auth?.userId]
  );

  useEffect(() => {
    setItems(readLS());
  }, [readLS]);

  const requireLogin = useCallback(() => {
    alert("찜은 로그인 후 이용 가능합니다.");
    navigate("/login", {
      state: { from: location.pathname + location.search },
    });
  }, [navigate, location]);

  const isWished = useCallback(
    (id) => items.some((it) => Number(it.id) === Number(id)),
    [items]
  );

  /**
   * toggleWish
   * @param {object|number|string} itemOrId - 카드 객체 전체(권장) 또는 id
   * @param {object} meta - itemOrId가 id만 왔을 때 저장할 메타({name,image,location,price})
   */
  const toggleWish = useCallback(
    (itemOrId, meta = {}) => {
      if (!isLoggedIn) return requireLogin();
      const base =
        typeof itemOrId === "object" ? itemOrId : { id: itemOrId, ...meta };
      const idNum = Number(base.id);
      if (!idNum || isNaN(idNum)) return;

      setItems((prev) => {
        const exists = prev.some((x) => Number(x.id) === idNum);
        const next = exists
          ? prev.filter((x) => Number(x.id) !== idNum)
          : [
              ...prev,
              {
                id: idNum,
                name: base.name ?? "",
                image: base.image ?? base.images?.[0] ?? "",
                location: base.location ?? "",
                price: base.price ?? 0,
              },
            ];
        writeLS(next);
        return next;
      });
    },
    [isLoggedIn, requireLogin, writeLS]
  );

  const removeWish = useCallback(
    (id) => {
      setItems((prev) => {
        const next = prev.filter((x) => Number(x.id) !== Number(id));
        writeLS(next);
        return next;
      });
    },
    [writeLS]
  );

  const clearWishes = useCallback(() => {
    setItems([]);
    writeLS([]);
  }, [writeLS]);

  return { isLoggedIn, items, isWished, toggleWish, removeWish, clearWishes };
}
