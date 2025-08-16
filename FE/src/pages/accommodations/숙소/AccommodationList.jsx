import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/pages/AccommodationList.css";
import { AxiosClient } from "../../../api/AxiosController";

const fetchAccommodations = async ({ isDomestic }) => {
  try {
    // 모든 API 호출을 Promise.all로 병렬 처리
    console.log(isDomestic)
    console.log({isDomestic: isDomestic ? "Y" : "N"})
    const [accroomData] = await Promise.all([
      AxiosClient("accommodations-rooms").get("", {
        params: { isDomestic: isDomestic ? "Y" : "N" },
      })
    ]);

    console.log(accroomData);
    
    const acc_room_data = accroomData.data;
    // console.log(acc_room_data)
    // 데이터가 없는 경우 처리
    if (!acc_room_data || !Array.isArray(acc_room_data)) {
      return { data: [] };
    }

    // 중복 제거 및 최저가 선택 로직
    const uniqueAccRooms = [];
    const seen = {};

    acc_room_data.forEach(acc_room => {
      const key = acc_room[0]; // accommodationId 기준
      if (!seen[key]) {
        seen[key] = acc_room;
      } else {
        // 이미 존재하면 가격(acc_room[22]) 값 비교하여 더 저렴한 것 선택
        if (acc_room[22] < seen[key][22]) {
          seen[key] = acc_room;
        }
      }
    });

    const result = Object.values(seen);
    const INDEX = {
      ACCOMMODATION_ID: 0,
      ADDRESS: 1,
      NAME: 10,
      IS_DOMESTIC: 7,
      RATING_AVG: 11,
      IMAGE_URL: 16,
      BASE_PRICE: 22
    };

    return {
      data: result.map((result_acc) => {
        return {
          id: result_acc[INDEX.ACCOMMODATION_ID],
          name: result_acc[INDEX.NAME],
          location: result_acc[INDEX.ADDRESS],
          isDomestic:result_acc[INDEX.IS_DOMESTIC],
          price: parseFloat(result_acc[INDEX.BASE_PRICE]) || 0, // 숫자로 변환
          rating: parseFloat(result_acc[INDEX.RATING_AVG]) || 0, // 숫자로 변환
          image: result_acc[INDEX.IMAGE_URL],
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
