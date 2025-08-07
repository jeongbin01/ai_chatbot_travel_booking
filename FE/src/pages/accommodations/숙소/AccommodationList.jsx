import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/pages/AccommodationList.css";
import { AxiosClient } from "../../../api/AxiosController";

const fetchAccommodations = async ({ isDomestic }) => {
  try {
    const [accRes, imageRes, roomTypeRes, priceRes] = await Promise.all([
      AxiosClient("accommodations/filter").get("", {
        params: { isDomestic: isDomestic ? "Y" : "N" },
      }),
      AxiosClient("accommodation-images").getAll(),
      AxiosClient("room-types").getAll(),
      AxiosClient("price-policies").getAll(),
    ]);

    const accommodations = accRes.data;
    const images = imageRes.data;
    const roomTypes = roomTypeRes.data;
    const prices = priceRes.data;

    return {
      data: accommodations.map((acc) => {
        const relatedRoomTypes = roomTypes.filter(
          (rt) => rt.accommodation_id === acc.accommodationId
        );
        const primaryRoomType = relatedRoomTypes[0];
        const relatedPrice = prices.find(
          (p) => p.roomType_id === primaryRoomType?.roomType_id
        );
        const mainImage = images.find(
          (img) =>
            img?.accommodation?.accommodationId === acc.accommodationId &&
            img?.orderNum === 1 &&
            img?.imageUrl
        );

        return {
          id: acc.accommodationId,
          name: acc.name,
          location: acc.address,
          price: relatedPrice?.basePrice ?? 0,
          capacity: primaryRoomType?.max_occupancy ?? 0,
          rating: acc.ratingAvg ?? 0,
          image: mainImage?.imageUrl ?? null,
        };
      }),
    };
  } catch (err) {
    console.error("fetchAccommodations error:", err);
    throw err;
  }
};

export default function AccommodationList({ isDomestic }) {
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const isFavorite = useCallback(
    (id) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (item) => {
      setFavorites((prev) =>
        isFavorite(item.id)
          ? prev.filter((fid) => fid !== item.id)
          : [...prev, item.id]
      );
    },
    [isFavorite]
  );

  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchAccommodations({ isDomestic });
        setAccommodations(res.data);
      } catch (err) {
        setError("숙소 정보를 불러오는데 실패했습니다.");
        console.error("Failed to fetch accommodations:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAccommodations();
  }, [isDomestic]);

  const filteredAccommodations = useMemo(() => {
    if (!search.trim()) return accommodations;
    return accommodations.filter(
      (acc) =>
        acc.name.toLowerCase().includes(search.toLowerCase()) ||
        acc.location.toLowerCase().includes(search.toLowerCase())
    );
  }, [accommodations, search]);

  const renderStars = useCallback((rating = 0) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <div className="star-rating" aria-label={`${rating}점 만점에 ${rating}점`}>
        {Array(full)
          .fill()
          .map((_, i) => (
            <i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>
          ))}
        {half && <i className="bi bi-star-half text-warning"></i>}
        {Array(empty)
          .fill()
          .map((_, i) => (
            <i key={`empty-${i}`} className="bi bi-star text-muted"></i>
          ))}
        <span className="rating-text ms-1">({rating})</span>
      </div>
    );
  }, []);

  if (error) {
    return (
      <div className="accommodation-list-wrapper">
        <div className="error-message">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button className="btn-retry" onClick={() => window.location.reload()}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="accommodation-list-wrapper">
      <header className="accommodation-header">
        <h2 className="accommodation-title">
          <i className="bi bi-house-door-fill me-2"></i>
          {isDomestic ? "국내 숙소 목록" : "해외 숙소 목록"}
        </h2>
        <div className="accommodation-stats">
          총 {filteredAccommodations.length}개의 숙소
        </div>
      </header>

      <div className="search-container">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="숙소명 또는 지역을 검색하세요"
            aria-label="숙소 검색"
          />
          {search && (
            <button
              className="search-clear"
              onClick={() => setSearch("")}
              aria-label="검색어 지우기"
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading" role="status" aria-live="polite">
          <div className="spinner"></div>
          <span>숙소 정보를 불러오는 중...</span>
        </div>
      ) : filteredAccommodations.length === 0 ? (
        <div className="no-results">
          <i className="bi bi-search me-2"></i>
          {search
            ? `'${search}'에 대한 검색 결과가 없습니다.`
            : "등록된 숙소가 없습니다."}
        </div>
      ) : (
        <div className="accommodation-grid">
          {filteredAccommodations.map((acc) => (
            <div
              key={acc.id}
              className="accommodation-card"
              aria-label={`${acc.name} 카드`}
            >
              <div className="image-container">
                <img
                  src={acc.image}
                  alt={`${acc.name} 숙소 이미지`}
                  className="accommodation-image"
                  loading="lazy"
                />
              </div>

              <div className="accommodation-content">
                <h3 className="acc-name">
                  {acc.name}
                </h3>
                <p className="acc-location">
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  {acc.location}
                </p>
                <p className="acc-price">

                  <span className="price-amount">
                    {acc.price.toLocaleString()}원
                  </span>
                  <span className="price-unit">
                    {" "}
                    / 1박 {acc.capacity}인
                  </span>
                </p>
                <div className="acc-rating">{renderStars(acc.rating)}</div>
              </div>

              <div className="card-actions">
                <button
                  className="btn-detail"
                  onClick={() =>
                    navigate(
                      `/${isDomestic ? "domesticpages" : "overseaspages"}/${
                        acc.id
                      }`
                    )
                  }
                >
                  <span>상세보기</span>
                </button>
                <button
                  className={isFavorite(acc.id) ? "favorite active" : "favorite"}
                  onClick={() => toggleFavorite(acc)}
                >
                  <i
                    className={`bi ${
                      isFavorite(acc.id) ? "bi-heart-fill" : "bi-heart"
                    } me-1`}
                  ></i>
                  <span>{isFavorite(acc.id) ? "찜 해제" : "찜"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
