import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import jejuImg from "../../../assets/images/국내 지역/제주도.jpg";
import busanImg from "../../../assets/images/국내 지역/부산.jpg";
import gangneungImg from "../../../assets/images/국내 지역/강릉.jpg";

export default function DomesticHome() {
  const [accommodations, setAccommodations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("전체");
  const [sortBy, setSortBy] = useState("추천순");
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(new Set(storedFavorites));

    setTimeout(() => {
      setAccommodations([
        {
          id: 1,
          name: "제주 오션뷰 호텔",
          type: "호텔",
          location: "제주도",
          image: jejuImg,
          rating: 4.7,
          price: 120000,
          description: "탁 트인 오션뷰가 매력적인 제주 호텔입니다.",
          badge: "인기",
        },
        {
          id: 2,
          name: "강릉 해변 펜션",
          type: "펜션",
          location: "강릉",
          image: gangneungImg,
          rating: 4.5,
          price: 90000,
          description: "강릉의 파도 소리를 들으며 힐링할 수 있는 숙소입니다.",
        },
        {
          id: 3,
          name: "부산 시티 뷰 모텔",
          type: "모텔",
          location: "부산",
          image: busanImg,
          rating: 4.2,
          price: 70000,
          description: "시내 접근성이 좋은 부산 숙소입니다.",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      localStorage.setItem("favorites", JSON.stringify(Array.from(updated)));
      return updated;
    });
  };

  const filtered = accommodations
    .filter(
      (acc) =>
        (filterType === "전체" || acc.type === filterType) &&
        acc.name.includes(searchTerm) &&
        (!showFavoritesOnly || favorites.has(acc.id))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "가격낮은순":
          return a.price - b.price;
        case "가격높은순":
          return b.price - a.price;
        case "평점높은순":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="domestic-home-container">
      <section className="domestic-hero-section">
        <div className="domestic-hero-content">
          <h1>어디로 떠나시나요?</h1>
          <p>당신만을 위한 국내 숙소를 찾아보세요</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="지역, 숙소명 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="favorites-toggle">
            <label>
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              />
              찜한 숙소만 보기
            </label>
          </div>
        </div>
      </section>

      <section className="filters">
        <div className="filter-bar">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="전체">전체</option>
            <option value="호텔">호텔</option>
            <option value="펜션">펜션</option>
            <option value="모텔">모텔</option>
            <option value="게스트하우스">게스트하우스</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="추천순">추천순</option>
            <option value="가격낮은순">가격낮은순</option>
            <option value="가격높은순">가격높은순</option>
            <option value="평점높은순">평점높은순</option>
          </select>
        </div>
      </section>

      <main className="accommodation-list">
        {isLoading ? (
          <p className="loading">
            <i className="bi bi-hourglass-split"></i> 로딩 중...
          </p>
        ) : filtered.length > 0 ? (
          filtered.map((acc) => (
            <div className="card" key={acc.id}>
              {acc.badge && <span className="badge">{acc.badge}</span>}
              <button
                className="favorite-btn"
                onClick={() => toggleFavorite(acc.id)}
              >
                <i
                  className={`bi ${
                    favorites.has(acc.id) ? "bi-heart-fill" : "bi-heart"
                  }`}
                ></i>
              </button>

              {/* ✅ 카드 전체를 Link로 감싸기 */}
              <Link to={`/accommodation/${acc.id}`} className="card-link">
                <img src={acc.image} alt={acc.name} />
                <div className="card-body">
                  <h3>{acc.name}</h3>
                  <p className="location">
                    <i className="bi bi-geo-alt-fill"></i> {acc.location}
                  </p>
                  <p className="rating">
                    <i className="bi bi-star-fill"></i> {acc.rating}점
                  </p>
                  <p className="price">
                    <i className="bi bi-currency-won"></i>{" "}
                    ₩{acc.price.toLocaleString()}원
                  </p>
                  <p className="description">{acc.description}</p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-results">검색 결과가 없습니다.</p>
        )}
      </main>
    </div>
  );
}
