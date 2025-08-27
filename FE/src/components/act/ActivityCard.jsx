import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/ActivityCard.css";

export default function ActivityCard({ item }) {
  const nav = useNavigate();
  const rating = Math.max(0, Math.min(5, Math.round(item?.rating ?? 0)));

  const goDetail = () => {
    // ✅ /activities/:type/:id 로 이동
    nav(`/activities/${item.type}/${item.id}`);
  };

  return (
    <article
      className="card card--clickable"
      onClick={goDetail}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") goDetail(); }}
      aria-label={`${item?.name ?? "액티비티 카드"} 상세 이동`}
    >
      <div className="card__media">
        {item?.thumbnail ? (
          <img className="card__img" src={item.thumbnail} alt={item?.name ?? "activity"} />
        ) : (
          <div className="card__img" aria-hidden="true" />
        )}

        {/* ⬇ 가격 배지는 제거, 타입(국내/해외)만 유지 */}
        <div className="badges">
          <span className="badge badge--type">{item?.type === "domestic" ? "국내" : "해외"}</span>
        </div>
      </div>

      <div className="card__body">
        <h3 className="card__title">{item?.name ?? "이름 미정"}</h3>
        {item?.location && <div className="card__location">📍 {item.location}</div>}
        {item?.description && <p className="card__desc">{item.description}</p>}

        {/* ⬇ 별점/카테고리 왼쪽,  가격은 오른쪽 끝에 고정 */}
        <div className="card__meta">
          <div className="stars" aria-label={`평점 ${item?.rating ?? "-"} / 5`}>
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} className={`star ${i <= rating ? "filled" : ""}`}>★</span>
            ))}
          </div>
          <span className="meta__pill">평점 {item?.rating ?? "-"}</span>
          {item?.category && <span className="meta__pill">#{item.category}</span>}

          {/* ✅ 여기(오른쪽) 가격 노출 */}
          <span className="meta__price">
            {typeof item?.price === "number" ? `${item.price.toLocaleString()}원` : "가격문의"}
          </span>
        </div>

        <div className="card__actions">
          <button
            type="button"
            className="btn-outline"
            onClick={(e)=>{ e.stopPropagation(); goDetail(); }}
          >
            자세히 보기
          </button>
        </div>
      </div>
    </article>
  );
}
