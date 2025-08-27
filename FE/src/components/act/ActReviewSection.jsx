import React, { useEffect, useMemo, useState } from "react";

const STORAGE_PREFIX = "act_reviews_";
const Star = ({ filled }) => <span className={filled ? "filled" : ""}>★</span>;

const ActReviewSection = ({ activityId }) => {
  const storageKey = `${STORAGE_PREFIX}${activityId}`;
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setReviews(saved ? JSON.parse(saved) : []);
    } catch (err) {
      console.error("리뷰 불러오기 실패:", err);
      setReviews([]);
    }
  }, [storageKey]);

  const save = (next) => {
    setReviews(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch (err) { console.error("리뷰 저장 실패:", err); }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) { alert("이름과 리뷰 내용을 입력하세요."); return; }
    if (editingId) {
      const next = reviews.map(r => r.id === editingId ? { ...r, name, rating, comment } : r);
      save(next);
      setEditingId(null);
    } else {
      save([...reviews, { id: crypto.randomUUID(), name, rating: Number(rating), comment, createdAt: Date.now() }]);
    }
    setName(""); setRating(5); setComment("");
  };

  const startEdit = (id) => {
    const r = reviews.find(v => v.id === id);
    if (!r) return;
    setEditingId(id); setName(r.name); setRating(Number(r.rating)); setComment(r.comment);
  };

  const remove = (id) => {
    if (!confirm("이 리뷰를 삭제할까요?")) return;
    save(reviews.filter(r => r.id !== id));
  };

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((s, r) => s + Number(r.rating), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  return (
    <section className="act-reviews">
      <h3>리뷰 ({reviews.length}) — 평균 {avg}점</h3>

      <ul className="act-review-list">
        {reviews.map(r => (
          <li key={r.id} className="act-review-item">
            <div className="stars" aria-label={`평점 ${r.rating}점`}>
              {[1,2,3,4,5].map(n => <Star key={n} filled={n <= r.rating} />)}
            </div>
            <p className="comment">{r.comment}</p>
            <div className="meta">
              <strong>{r.name}</strong>
              <div className="actions">
                <button type="button" onClick={() => startEdit(r.id)}>수정</button>
                <button type="button" onClick={() => remove(r.id)}>삭제</button>
              </div>
            </div>
          </li>
        ))}
        {!reviews.length && <li className="empty">아직 리뷰가 없습니다.</li>}
      </ul>

      <form onSubmit={submit} className="act-review-form">
        <label>이름* <input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>평점
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label>리뷰*
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} required maxLength={500}/>
        </label>
        <button type="submit">{editingId ? "수정 완료" : "리뷰 등록"}</button>
      </form>
    </section>
  );
};

export default ActReviewSection;
