// src/components/common/ToastPortal.jsx
import React, { useEffect, useMemo, useState, useLayoutEffect } from "react";

const WISHLIST_EVENT = "wishlist:changed";

/**
 * placement: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'
 * mobilePlacement: 모바일 전용 위치 (기본 'bottom-center')
 * xOffset, yOffset: number(px) | string('calc(...)')
 * offsetSelector: 고정 헤더 선택자. 지정하면 해당 엘리먼트의 bottom에 yOffset을 더해 자동 배치.
 * offsetPadding: offsetSelector 사용 시 여백(px)
 * duration: 표시 시간(ms)
 */
export default function ToastPortal({
  placement = "top-center",
  mobilePlacement = "bottom-center",
  xOffset = 16,
  yOffset = "calc(var(--app-header-height, 72px) + 12px)", // 헤더 아래 기본
  mobileBreakpoint = 768,
  offsetSelector, // 예: '.app-header' (고정 헤더 아래 자동 정렬)
  offsetPadding = 12,
  duration = 2200,
}) {
  const [toasts, setToasts] = useState([]);
  const [autoYOffset, setAutoYOffset] = useState(null);

  // 헤더 높이 기반 자동 y 오프셋 계산
  useLayoutEffect(() => {
    if (!offsetSelector) return;
    const compute = () => {
      const el = document.querySelector(offsetSelector);
      if (!el) return setAutoYOffset(null);
      const rect = el.getBoundingClientRect();
      setAutoYOffset(rect.bottom + offsetPadding); // 헤더 bottom + 여백
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, { passive: true });
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute);
    };
  }, [offsetSelector, offsetPadding]);

  // 위치 결정 (모바일 분기)
  const currentPlacement = useMemo(() => {
    if (typeof window !== "undefined" && window.innerWidth <= mobileBreakpoint) {
      return mobilePlacement || placement;
    }
    return placement;
  }, [placement, mobilePlacement, mobileBreakpoint]);

  // 컨테이너 스타일
  const containerStyle = useMemo(() => {
    const x = typeof xOffset === "string" ? xOffset : `${xOffset}px`;
    const baseY = autoYOffset != null ? `${autoYOffset}px` : (typeof yOffset === "string" ? yOffset : `${yOffset}px`);
    const base = {
      position: "fixed",
      zIndex: 9999,
      display: "flex",
      gap: 10,
      pointerEvents: "none",
    };

    switch (currentPlacement) {
      case "top-left":
        return { ...base, top: baseY, left: x, flexDirection: "column", alignItems: "flex-start" };
      case "top-center":
        return { ...base, top: baseY, left: "50%", transform: "translateX(-50%)", flexDirection: "column", alignItems: "center" };
      case "bottom-left":
        return { ...base, bottom: baseY, left: x, flexDirection: "column-reverse", alignItems: "flex-start" };
      case "bottom-center":
        return { ...base, bottom: baseY, left: "50%", transform: "translateX(-50%)", flexDirection: "column-reverse", alignItems: "center" };
      case "bottom-right":
        return { ...base, bottom: baseY, right: x, flexDirection: "column-reverse", alignItems: "flex-end" };
      case "top-right":
      default:
        return { ...base, top: baseY, right: x, flexDirection: "column", alignItems: "flex-end" };
    }
  }, [currentPlacement, xOffset, yOffset, autoYOffset]);

  // 위시리스트 이벤트 → 토스트
  useEffect(() => {
    const onChange = (e) => {
      const { action, item } = e.detail || {};
      if (!action) return;

      let msg = "";
      if (action === "added") msg = `‘${item?.name ?? "항목"}’ 찜에 추가했어요.`;
      else if (action === "removed") msg = `‘${item?.name ?? "항목"}’ 찜을 해제했어요.`;
      else if (action === "cleared") msg = "찜 목록을 비웠어요.";
      if (!msg) return;

      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, msg, visible: false }]);

      // 등장 애니메이션 트리거
      requestAnimationFrame(() => {
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: true } : t)));
      });

      // 자동 제거
      setTimeout(() => {
        // 퇴장 애니메이션
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)));
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 200); // 퇴장 트랜지션 시간과 일치
      }, duration);
    };
    window.addEventListener(WISHLIST_EVENT, onChange);
    return () => window.removeEventListener(WISHLIST_EVENT, onChange);
  }, [duration]);

  return (
    <div style={containerStyle} aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: "rgba(26,26,26,0.92)",
            color: "#fff",
            padding: "10px 12px",
            borderRadius: 12,
            boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            maxWidth: 360,
            width: "max-content",
            lineHeight: 1.35,
            pointerEvents: "auto",
            transform: t.visible ? "translateY(0)" : (currentPlacement.startsWith("bottom") ? "translateY(8px)" : "translateY(-8px)"),
            opacity: t.visible ? 1 : 0,
            transition: "opacity 200ms ease, transform 200ms ease",
            backdropFilter: "saturate(180%) blur(6px)",
          }}
          role="status"
        >
          <i className="bi bi-check2-circle" aria-hidden="true" />
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
