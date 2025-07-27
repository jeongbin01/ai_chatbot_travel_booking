import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import "../../../styles/pages/AccommodationList.css";
import { AxiosClient } from "../../../api/AxiosController";

const fetchAccommodations = async () => {
  try {
    const [accRes, imageRes, roomTypeRes, priceRes] = await Promise.all([
      AxiosClient("accommodations").getAll(),
      AxiosClient("accommodation-images").getAll(),
      AxiosClient("room-types").getAll(),
      AxiosClient("price-policies").getAll(),
    ]);

    const accommodations = accRes.data;
    const images = imageRes.data;
    const roomTypes = roomTypeRes.data;
    const prices = priceRes.data;

    const result = accommodations.map((acc) => {
      // 이 숙소에 해당하는 roomTypes
      const relatedRoomTypes = roomTypes.filter(rt => rt.accommodation_id === acc.accommodation_id);

      // 가장 첫 번째 roomType 기준으로 가격 및 인원 추출
      const primaryRoomType = relatedRoomTypes[0];

      // pricePolicy에서 해당 roomType_id의 정책 찾기
      const price = prices[0]?.basePrice ?? 0;
      // 이미지 중 order_num이 가장 작은 하나만 사용
      const mainImage = images.find(
        img => img.accommodation.accommodationId === acc.accommodationId && img.orderNum === 1
      );
      console.log(prices)
      return {
        id: acc.accommodationId,
        name: acc.name,
        location: acc.address,
        price: price,
        capacity: primaryRoomType?.max_occupancy ?? 0,
        rating: acc.ratingAvg ?? 0,
        liked: false,
        image: mainImage?.imageUrl ?? "", // 기본 이미지가 없으면 빈 문자열
      };
    });
    return { data: result };
  } catch (err) {
    console.error("fetchAccommodations error:", err);
    throw err;
  }
};

export default function AccommodationList() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchAccommodations();
        setAccommodations(res.data);
      } catch (err) {
        setError("숙소 정보를 불러오는데 실패했습니다.");
        console.error("Failed to fetch accommodations:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAccommodations();
  }, []);

  const toggleLike = useCallback((id, event) => {
    event?.stopPropagation();
    setAccommodations((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, liked: !acc.liked } : acc
      )
    );
  }, []);

  const filteredAccommodations = useMemo(() => {
    if (!search.trim()) return accommodations;

    return accommodations.filter((acc) =>
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
        {Array(full).fill().map((_, i) => (
          <i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>
        ))}
        {half && <i className="bi bi-star-half text-warning"></i>}
        {Array(empty).fill().map((_, i) => (
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
          <button 
            className="btn-retry"
            onClick={() => window.location.reload()}
          >
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
          <i className="bi bi-house-door-fill me-2"></i>국내 숙소 목록
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
          {search ? `'${search}'에 대한 검색 결과가 없습니다.` : "등록된 숙소가 없습니다."}
        </div>
      ) : (
        <div className="accommodation-grid">
          {filteredAccommodations.map((acc) => (
            <Link
              to={`/domesticpages/${acc.id}`}
              key={acc.id}
              className="accommodation-card"
              aria-label={`${acc.name} 상세정보 보기`}
            >
              <button
                className={`like-button ${acc.liked ? 'liked' : ''}`}
                onClick={(e) => toggleLike(acc.id, e)}
                aria-label={acc.liked ? "찜 해제" : "찜하기"}
              >
                <i className={`bi ${acc.liked ? "bi-heart-fill" : "bi-heart"}`}></i>
              </button>
              
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
                  <i className="bi bi-building me-2"></i>
                  {acc.name}
                </h3>
                <p className="acc-location">
                  <i className="bi bi-geo-alt-fill me-1"></i> 
                  {acc.location}
                </p>
                <p className="acc-price">
                  <i className="bi bi-cash-coin me-1"></i>
                  <span className="price-amount">{acc.price.toLocaleString()}원</span>
                  <span className="price-unit"> / 1박 {acc.capacity}인</span>
                </p>
                <div className="acc-rating">
                  {renderStars(acc.rating)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}