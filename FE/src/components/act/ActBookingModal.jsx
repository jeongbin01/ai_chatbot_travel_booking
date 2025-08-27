import React, { useEffect, useState } from "react";

const ActBookingModal = ({ open, activity, onClose, onConfirm }) => {
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(1);

  useEffect(() => {
    if (open) { setDate(""); setPeople(1); }
  }, [open]);

  if (!open) return null;

  const submit = () => {
    if (!date) { alert("예약 날짜를 선택하세요."); return; }
    const payload = {
      activityId: activity?.id ?? null,
      activityName: activity?.name ?? "액티비티",
      date,
      people,
    };
    try { onConfirm?.(payload); }
    catch (err) { console.error("예약 처리 실패:", err); }
    finally { onClose?.(); }
  };

  return (
    <div className="act-modal-backdrop" role="dialog" aria-modal="true">
      <div className="act-modal">
        <h3>{activity?.name ?? "액티비티 예약"}</h3>

        <label className="field">
          날짜
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <label className="field">
          인원
          <select value={people} onChange={(e) => setPeople(Number(e.target.value))}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>

        <div className="modal-actions">
          <button type="button" className="btn-outline" onClick={onClose}>취소</button>
          <button type="button" className="btn-primary" onClick={submit}>예약하기</button>
        </div>
      </div>
    </div>
  );
};

export default ActBookingModal;
