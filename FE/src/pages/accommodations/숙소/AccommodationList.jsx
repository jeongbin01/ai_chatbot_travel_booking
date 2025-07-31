import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import "../../../styles/pages/AccommodationList.css";
import { AxiosClient } from "../../../api/AxiosController";

import gangneungImg from "../../../assets/images/domestic/강릉.jpg";
import sokchoImg from "../../../assets/images/domestic/속초.jpg";
import yeosuImg from "../../../assets/images/domestic/여수.jpg";
import incheonImg from "../../../assets/images/domestic/인천.jpg";
import jejuImg from "../../../assets/images/domestic/제주도.jpg";

import romaImg from "../../../assets/images/overseas/로마.jpg";
import bangkokImg from "../../../assets/images/overseas/방콕.jpg";
import singaporeImg from "../../../assets/images/overseas/싱카프로.jpg";
import parisImg from "../../../assets/images/overseas/로마.jpg";

// 이미지 매핑 테이블
const DOMESTIC_IMAGES = {
  "강릉 게스트하우스": gangneungImg,
  "속초 리조트": sokchoImg,
  "여수 게스트하우스": yeosuImg,
  "인천 비즈니스 호텔": incheonImg,
  "제주도 오션뷰 펜션": jejuImg,
};

const OVERSEAS_IMAGES = {
  "로마 부티크 호텔": romaImg,
  "방콕 리버사이드 호텔": bangkokImg,
  "싱가포르 시티 호텔": singaporeImg,
  "파리 센강 호텔": parisImg,
};

// ✅ 숙소별 가격 문구 하드코딩 함수
const getFixedPriceText = (name) => {
  switch (name) {
    case "강릉 게스트하우스":
      return "1박 2인 / ₩85,000";
    case "속초 리조트":
      return "1박 4인 / ₩120,000";
    case "여수 게스트하우스":
      return "1박 2인 / ₩90,000";
    case "인천 비즈니스 호텔":
      return "1박 2인 / ₩110,000";
    case "제주도 오션뷰 펜션":
      return "1박 3인 / ₩130,000";
    case "로마 부티크 호텔":
      return "1박 2인 / ₩210,000";
    case "방콕 리버사이드 호텔":
      return "1박 3인 / ₩115,000";
    case "싱가포르 시티 호텔":
      return "1박 2인 / ₩198,000";
    case "파리 센강 호텔":
      return "1박 2인 / ₩230,000";
    default:
      return "1박 기준 / 가격 미정";
  }
};

// ✅ 숙소 데이터 불러오기
const fetchAccommodations = async () => {
  const [accRes, imageRes] = await Promise.all([
    AxiosClient("accommodations").getAll(),
    AxiosClient("accommodation-images").getAll(),
  ]);

  const accommodations = accRes.data;
  const images = imageRes.data;

  return {
    data: accommodations.map((acc) => {
      const mainImage = images.find(
        (img) =>
          img.accommodation.accommodationId === acc.accommodationId &&
          img.orderNum === 1
      );

      return {
        id: acc.accommodationId,
        name: acc.name,
        location: acc.address,
        rating: acc.ratingAvg ?? 0,
        liked: false,
        image: mainImage?.imageUrl || "",
        isDomestic: acc.isDomestic === "Y",
      };
    }),
  };
};

export default function AccommodationList({ isDomestic }) {
  const [allAccommodations, setAllAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        const res = await fetchAccommodations();
        setAllAccommodations(res.data);
      } catch {
        alert("숙소 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadAccommodations();
  }, []);

  const filteredByType = useMemo(() => {
    return allAccommodations.filter((acc) => acc.isDomestic === isDomestic);
  }, [allAccommodations, isDomestic]);

  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return filteredByType;
    return filteredByType.filter(
      (acc) =>
        acc.name.toLowerCase().includes(search.toLowerCase()) ||
        acc.location.toLowerCase().includes(search.toLowerCase())
    );
  }, [filteredByType, search]);

  const imageMap = isDomestic ? DOMESTIC_IMAGES : OVERSEAS_IMAGES;
  const finalList = useMemo(() => {
    return filteredBySearch.map((acc) => ({
      ...acc,
      image: acc.image || imageMap[acc.name] || imageMap.default,
    }));
  }, [filteredBySearch, imageMap]);

  const toggleLike = useCallback((id, event) => {
    event?.stopPropagation();
    setAllAccommodations((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, liked: !acc.liked } : acc))
    );
  }, []);

  const renderStars = (rating = 0) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <div className="star-rating">
        {Array(full)
          .fill()
          .map((_, i) => (
            <i key={`full-${i}`} className="bi bi-star-fill text-warning" />
          ))}
        {half && <i className="bi bi-star-half text-warning" />}
        {Array(empty)
          .fill()
          .map((_, i) => (
            <i key={`empty-${i}`} className="bi bi-star text-muted" />
          ))}
        <span className="rating-text ms-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span>숙소 정보를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="accommodation-list-wrapper">
      <h2 className="accommodation-title">
        {isDomestic ? "국내 숙소" : "해외 숙소"}
      </h2>
      <div className="search-container">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="숙소명 또는 지역을 검색하세요"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              <i className="bi bi-x" />
            </button>
          )}
        </div>
      </div>

      <div className="accommodation-grid">
        {finalList.map((acc) => (
          <div className="accommodation-card-wrapper" key={acc.id}>
            <button
              className={`like-button ${acc.liked ? "liked" : ""}`}
              onClick={() => toggleLike(acc.id)}
              aria-label={acc.liked ? "찜 해제" : "찜하기"}
            >
              <i className={`bi ${acc.liked ? "bi-heart-fill" : "bi-heart"}`} />
            </button>

            <Link
              to={`/${isDomestic ? "domesticpages" : "overseaspages"}/${
                acc.id
              }`}
              className="accommodation-card"
            >
              <div className="image-container">
                <img
                  src={acc.image}
                  alt={`${acc.name} 숙소 이미지`}
                  className="accommodation-image"
                />
                <span
                  className={`badge ${
                    isDomestic ? "badge-domestic" : "badge-overseas"
                  }`}
                >
                  {isDomestic ? "국내" : "해외"}
                </span>
              </div>

              <div className="accommodation-content">
                <h3 className="acc-name">{acc.name}</h3>
                <p className="acc-location">
                  <i className="bi bi-geo-alt-fill me-1"></i> {acc.location}
                </p>
                <p className="acc-price">{getFixedPriceText(acc.name)}</p>
                <div className="acc-rating">{renderStars(acc.rating)}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
