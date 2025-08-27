import React from "react";

const ActShareButtons = ({
  title = "이 액티비티",
  url = typeof window !== "undefined" ? window.location.href : "",
}) => {
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); alert("링크가 복사되었습니다."); }
    catch (err) { console.error("클립보드 복사 실패:", err); }
  };

  const share = async () => {
    try {
      if (navigator.share) { await navigator.share({ title, url }); }
      else { await copy(); }
    } catch (err) {
      console.error("공유 실패(또는 사용자 취소):", err);
    }
  };

  return (
    <div className="act-share">
      <button type="button" className="btn-outline" onClick={share}>공유하기</button>
      <button type="button" className="btn-outline" onClick={copy}>링크복사</button>
    </div>
  );
};

export default ActShareButtons;
