import React, { useEffect, useState } from "react";
import "../../styles/layout/MainPage.css";

function MainPage() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const topVideos = [
    { src: "/videos/vid1.mp4", title: "서울 야경", desc: "한강과 함께하는 밤" },
    {
      src: "/videos/vid2.mp4",
      title: "부산 해운대",
      desc: "탁 트인 바다 풍경",
    },
    {
      src: "/videos/vid3.mp4",
      title: "전주 한옥마을",
      desc: "전통이 살아있는 골목",
    },
    {
      src: "/videos/vid4.mp4",
      title: "강릉 커피거리",
      desc: "커피 향 가득한 해변",
    },
    {
      src: "/videos/vid5.mp4",
      title: "속초 설악산",
      desc: "절경 속 힐링 트레킹",
    },
    {
      src: "/videos/vid6.mp4",
      title: "인천 차이나타운",
      desc: "이국적인 거리 풍경",
    },
    {
      src: "/videos/vid7.mp4",
      title: "제주 성산일출봉",
      desc: "제주의 일출 명소",
    },
    {
      src: "/videos/vid8.mp4",
      title: "경주 유적지",
      desc: "천년의 숨결이 담긴 곳",
    },
  ];

  const renderVideoCards = () => (
    <section className="top-video-section">
      <h3>
        <i className="bi bi-camera-video-fill"></i> 국내 여행지 영상
      </h3>
      <div className="video-grid">
        {topVideos.map((video, i) => (
          <div key={i} className="video-card">
            <video src={video.src} controls muted />
            <div className="video-info">
              <h4>{video.title}</h4>
              <p>{video.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderTravelAlerts = () => (
    <section className="travel-alerts">
      <h3>
        <i className="bi bi-bell-fill"></i> 여행 알림
      </h3>
      <div className="alert-box">
        <i className="bi bi-exclamation-triangle-fill"></i>
        새로운 할인 상품이 등록되었습니다!
        <br />
        제주도 패키지 여행 30% 할인
      </div>
      <div className="alert-box">
        <i className="bi bi-check-circle-fill"></i>
        정보가 저렴해 집니다.
        <br />
        지금 예약하고 최대 50% 할인받으세요
      </div>
    </section>
  );

  const renderReviews = () => {
    const reviews = [
      { text: "정말 만족스러운 여행이었어요!", author: "김철수" },
      { text: "친절한 응대와 다양한 상품이 좋아요.", author: "이영희" },
      { text: "AI 도우미 덕분에 일정이 완벽했어요!", author: "박민수" },
    ];
    return (
      <section className="review-section">
        <h3>
          <i className="bi bi-star-fill"></i> 고객 리뷰
        </h3>
        <div className="review-list">
          {reviews.map((r, idx) => (
            <div key={idx} className="review-item">
              <p>"{r.text}"</p>
              <span>— {r.author}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const cardList = (title, items, tagLabel) => (
    <section className="travel-section">
      <h3>
        <i className="bi bi-geo-alt-fill"></i> {title}
      </h3>{" "}
      {/* 제목 아이콘 변경 가능 */}
      <div className="card-list">
        {items.slice(0, 5).map((item, i) => (
          <div key={i} className="travel-card">
            <div className="card-image">
              <i
                className="bi bi-image"
                style={{ fontSize: "2rem", color: "#ccc" }}
              ></i>
            </div>

            <div className="card-info">
              <p className="product-name">
                <i className="bi bi-building-fill"></i> {item.name}
              </p>

              {item.location && (
                <p className="location">
                  <i className="bi bi-geo-alt"></i> {item.location}
                </p>
              )}

              {item.rating && (
                <p className="rating">
                  <i className="bi bi-star-fill" style={{ color: "gold" }}></i>{" "}
                  {item.rating}
                </p>
              )}

              <p className="price">
                <i className="bi bi-cash-coin"></i> {item.price}
              </p>
            </div>

            {tagLabel && (
              <span className="tag">
                <i className="bi bi-tags-fill"></i> {tagLabel}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  const discountPackages = [
    { name: "제주 패키지", price: "₩149,000" },
    { name: "부산 패키지", price: "₩159,000" },
    { name: "서울 패키지", price: "₩169,000" },
    { name: "강릉 패키지", price: "₩139,000" },
    { name: "경주 패키지", price: "₩129,000" },
  ];

  const discountPlaces = [
    { name: "남해 섬투어", price: "₩89,000" },
    { name: "단양 액티비티", price: "₩79,000" },
    { name: "속초 설악산", price: "₩69,000" },
    { name: "여수 밤바다", price: "₩99,000" },
    { name: "포항 해변", price: "₩59,000" },
  ];

  const popularPlaces = [
    { name: "서울 명소", location: "서울", rating: "4.5", price: "₩150,000" },
    { name: "제주 중문", location: "제주", rating: "4.7", price: "₩200,000" },
    { name: "부산 해운대", location: "부산", rating: "4.6", price: "₩180,000" },
    {
      name: "강릉 커피거리",
      location: "강릉",
      rating: "4.8",
      price: "₩170,000",
    },
    { name: "경주 유적지", location: "경주", rating: "4.4", price: "₩160,000" },
  ];

  const domesticPlaces = [
    { name: "서울 투어", location: "서울", rating: "4.5", price: "₩60,000" },
    { name: "부산 맛집", location: "부산", rating: "4.6", price: "₩70,000" },
    {
      name: "제주 자유여행",
      location: "제주",
      rating: "4.7",
      price: "₩80,000",
    },
    { name: "인천 월미도", location: "인천", rating: "4.4", price: "₩55,000" },
    {
      name: "속초 힐링여행",
      location: "속초",
      rating: "4.5",
      price: "₩75,000",
    },
  ];

  const overseasPlaces = [
    { name: "도쿄 여행", location: "일본", rating: "4.9", price: "₩320,000" },
    { name: "다낭 여행", location: "베트남", rating: "4.8", price: "₩280,000" },
    { name: "방콕 여행", location: "태국", rating: "4.7", price: "₩310,000" },
    { name: "뉴욕 여행", location: "미국", rating: "4.8", price: "₩1,200,000" },
    {
      name: "파리 여행",
      location: "프랑스",
      rating: "4.9",
      price: "₩1,400,000",
    },
  ];

  return (
    <div className="main-wrapper">
      {renderVideoCards()}
      {renderTravelAlerts()}
      {cardList("🌴 할인 여행 패키지", discountPackages, "할인")}
      {cardList("🔥 할인 여행지", discountPlaces, "특가")}
      {cardList("인기 여행지", popularPlaces, "인기")}
      {cardList("🇰🇷 국내 여행", domesticPlaces, "국내")}
      {cardList("✈ 해외 여행", overseasPlaces, "해외")}
      {renderReviews()}

      <div className="ai-widget">
        <div className="ai-chat">
          <i className="bi bi-robot"></i>
          <span>AI 여행 도우미</span>
        </div>
        <div className="chat-box">
          <p>궁금한 것이 있으신가요?</p>
          <button>
            <i className="bi bi-chat-dots"></i> 채팅 시작하기
          </button>
        </div>
      </div>

      {showTopBtn && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <i className="bi bi-arrow-up"></i>
        </button>
      )}
    </div>
  );
}

export default MainPage;