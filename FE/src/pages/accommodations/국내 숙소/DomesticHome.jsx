// src/pages/accommodations/DomesticHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jejuImg from "../../../assets/images/국내 지역/제주도.jpg";
import busanImg from "../../../assets/images/국내 지역/부산.jpg";
import gangneungImg from "../../../assets/images/국내 지역/강릉.jpg";
import "../../../styles/pages/DomesticHome.css";

export default function DomesticHome() {
  const [accommodations, setAccommodations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("추천순");
  const [favorites, setFavorites] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(new Set(stored));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setAccommodations([
        {
          id: 1,
          name: "제주 오션뷰 호텔",
          location: "제주도",
          image: jejuImg,
          rating: 4.7,
          price: 120000,
          badge: "인기",
        },
        {
          id: 2,
          name: "강릉 해변 펜션",
          location: "강릉",
          image: gangneungImg,
          rating: 4.5,
          price: 90000,
        },
        {
          id: 3,
          name: "부산 시티 뷰 모텔",
          location: "부산",
          image: busanImg,
          rating: 4.2,
          price: 70000,
          badge: "특가",
        },
      ]);
      setIsLoading(false);
    }, 600);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      localStorage.setItem("favorites", JSON.stringify([...updated]));
      return updated;
    });
  };

  const filtered = accommodations
    .filter((acc) => acc.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((acc) => !showFavoritesOnly || favorites.has(acc.id))
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
    <div className="domestic-container">
      <div className="filter-bar">
        <div className="search-wrapper full-width">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="숙소명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-bottom">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="추천순">추천순</option>
            <option value="가격낮은순">가격 낮은순</option>
            <option value="가격높은순">가격 높은순</option>
            <option value="평점높은순">평점 높은순</option>
          </select>

          <label className="favorite-toggle">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            />
            찜 보기
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">숙소 정보를 불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">조건에 맞는 숙소가 없습니다.</div>
      ) : (
        <div className="accommodation-grid">
          {filtered.map((acc) => (
            <div key={acc.id} className="accommodation-card">
              <Link to={`/accommodation/${acc.id}`}>
                <img src={acc.image} alt={acc.name} className="acc-thumbnail" />
              </Link>

              <div className="acc-info">
                <div className="acc-name">
                  {acc.name}
                  {acc.badge && (
                    <span className={`badge ${acc.badge === "인기" ? "badge-hot" : "badge-sale"}`}>
                      {acc.badge}
                    </span>
                  )}
                </div>

                <div className="acc-meta">
                  <span className="acc-location">
                    <i className="bi bi-geo-alt-fill"></i> {acc.location}
                  </span>
                  <span className="acc-rating text-warning fw-bold">
                    <i className="bi bi-star-fill me-1"></i> {acc.rating.toFixed(1)}
                  </span>
                </div>

                <div className="acc-price">
                  <i className="bi bi-currency-won"></i> ₩
                  {acc.price.toLocaleString()}원 <span className="price-unit">/ 1박</span>
                </div>
              </div>

              <button
                className="heart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(acc.id);
                }}
                aria-label={favorites.has(acc.id) ? "찜 해제" : "찜 추가"}
                title={favorites.has(acc.id) ? "찜 해제" : "찜 추가"}
              >
                <i
                  className={`bi ${
                    favorites.has(acc.id)
                      ? "bi-heart-fill text-danger"
                      : "bi-heart"
                  }`}
                ></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
