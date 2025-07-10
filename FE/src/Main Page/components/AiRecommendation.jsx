import './AiRecommendation.css';

function AiRecommendation() {
  return (
    <section className="ai-recommendation">
      <h4><i className="bi bi-geo-alt-fill"></i> 추천 여행지</h4>
      <div className="travel-card">
        <div className="travel-image">
          <img src="https://source.unsplash.com/800x400/?jeju,island" alt="제주도" />
          <span className="badge">추천</span>
        </div>
        <div className="travel-info">
          <h3>제주도</h3>
          <p>아름다운 자연과 함께</p>
          <div className="travel-meta">
            <span><i className="bi bi-geo-alt"></i> 제주시</span>
            <span><i className="bi bi-star-fill"></i> 4.8/5</span>
            <span><i className="bi bi-currency-won"></i> ₩150,000~</span>
            <span><i className="bi bi-clock"></i> 2박3일</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AiRecommendation;
