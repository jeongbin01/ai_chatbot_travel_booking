// 액티비티 전용 결제 모달 (숙소 PaymentModal과 이름 충돌 방지)
import React, { useState } from "react";
import "../../styles/pages/ActivityPaymentModal.css";

export default function ActivityPaymentModal({ amount = 0, onClose, onPaymentSuccess }) {
  const [method, setMethod] = useState("card"); // "card" | "bank"
  const [loading, setLoading] = useState(false);

  // 카드 결제 입력
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpire, setCardExpire] = useState(""); // MM/YY
  const [cardCvc, setCardCvc] = useState("");

  // 계좌 이체 입력
  const [bank, setBank] = useState("국민");
  const [account, setAccount] = useState("");

  const submit = async () => {
    if (loading) return;

    // 간단 유효성 검사
    if (method === "card") {
      if (!/^\d{12,19}$/.test(cardNumber.replace(/\s+/g, ""))) return alert("카드번호를 확인하세요.");
      if (!/^\d{2}\/\d{2}$/.test(cardExpire)) return alert("유효기간은 MM/YY 형식으로 입력하세요.");
      if (!/^\d{3,4}$/.test(cardCvc)) return alert("CVC를 확인하세요.");
    } else {
      if (!bank) return alert("은행을 선택하세요.");
      if (!/^\d{8,20}$/.test(account.replace(/-/g, ""))) return alert("계좌번호를 확인하세요.");
    }

    setLoading(true);
    try {
      // 실제 결제 연동 대신 데모 딜레이
      await new Promise((r) => setTimeout(r, 700));
      const paymentInfo = {
        method,
        paidAt: new Date().toISOString(),
        amount,
        ...(method === "card"
          ? { cardInfo: { cardNumber, cardExpire, cardCvc } }
          : { bankInfo: { bank, account } }),
      };
      onPaymentSuccess?.(paymentInfo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paymodal__backdrop" role="dialog" aria-modal="true" aria-label="결제 모달">
      <div className="paymodal">
        <header className="paymodal__header">
          <h3>결제</h3>
          <button className="iconbtn" onClick={onClose} aria-label="닫기">✕</button>
        </header>

        <div className="paymodal__body">
          <div className="price">결제 금액 <strong>{amount.toLocaleString()}원</strong></div>

          <div className="method">
            <button className={`pill ${method === "card" ? "is-active" : ""}`} onClick={() => setMethod("card")}>카드 결제</button>
            <button className={`pill ${method === "bank" ? "is-active" : ""}`} onClick={() => setMethod("bank")}>계좌 이체</button>
          </div>

          {method === "card" ? (
            <div className="form">
              <label><span>카드 번호</span>
                <input inputMode="numeric" placeholder="숫자만 입력" value={cardNumber} onChange={(e)=>setCardNumber(e.target.value)} />
              </label>
              <div className="row">
                <label><span>유효기간 (MM/YY)</span>
                  <input inputMode="numeric" placeholder="MM/YY" value={cardExpire} onChange={(e)=>setCardExpire(e.target.value)} />
                </label>
                <label><span>CVC</span>
                  <input inputMode="numeric" placeholder="3~4자리" value={cardCvc} onChange={(e)=>setCardCvc(e.target.value)} />
                </label>
              </div>
            </div>
          ) : (
            <div className="form">
              <label><span>은행</span>
                <select value={bank} onChange={(e)=>setBank(e.target.value)}>
                  {["국민","우리","신한","하나","농협","기업","카카오뱅크"].map(b=><option key={b} value={b}>{b}</option>)}
                </select>
              </label>
              <label><span>계좌번호</span>
                <input inputMode="numeric" placeholder="숫자/하이픈 입력 가능" value={account} onChange={(e)=>setAccount(e.target.value)} />
              </label>
            </div>
          )}
        </div>

        <footer className="paymodal__footer">
          <button className="btn-outline" onClick={onClose} disabled={loading}>취소</button>
          <button className="btn" onClick={submit} disabled={loading}>{loading ? "결제 중..." : "결제하기"}</button>
        </footer>
      </div>
    </div>
  );
}
