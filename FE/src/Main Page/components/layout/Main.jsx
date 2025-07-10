import "./Main.css";

const Main = () => {
  return (
    <main className="main-content">
      <h1>AI 여행 플랫폼에 오신 것을 환영합니다!</h1>
      <p>국내·해외 숙소, 항공권, 렌터카, 액티비티를 한 곳에서 예약하세요.</p>
      <section className="main-section">
        <div className="card">
          <h3>인기 숙소</h3>
          <p>가장 많이 예약된 숙소들을 모아봤어요.</p>
        </div>
        <div className="card">
          <h3>특가 항공권</h3>
          <p>지금 예약하면 최대 70% 할인!</p>
        </div>
        <div className="card">
          <h3>AI 추천</h3>
          <p>당신만을 위한 맞춤형 여행 코스를 제안합니다.</p>
        </div>
      </section>
    </main>
  );
};

export default Main;
