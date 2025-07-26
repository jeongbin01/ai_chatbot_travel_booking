import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/pages/AccommodationDetail.css";

const sampleAccommodations = [
  {
    id: 1,
    name: "제주도 오션뷰 펜션",
    location: "제주특별자치도 서귀포시",
    price: 120000,
    capacity: 4,
    rating: 4.5,
    liked: false,
    description: "제주도의 아름다운 바다를 한눈에 볼 수 있는 오션뷰 펜션입니다. 깨끗하고 현대적인 시설로 편안한 휴식을 제공합니다.",
    amenities: ["Wi-Fi", "주차장", "에어컨", "바베큐장", "오션뷰", "취사가능"],
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&crop=center"
    ],
    checkIn: "15:00",
    checkOut: "11:00",
    policies: ["금연", "반려동물 불가", "파티 불가"],
    contact: "064-123-4567",
    address: "제주특별자치도 서귀포시 중문관광로 123"
  },
  {
    id: 2,
    name: "강릉 바다 근처 게스트하우스",
    location: "강원도 강릉시",
    price: 85000,
    capacity: 6,
    rating: 4.2,
    liked: false,
    description: "강릉의 아름다운 해변과 가까운 곳에 위치한 아늑한 게스트하우스입니다. 가족 단위 여행객들에게 인기가 높습니다.",
    amenities: ["Wi-Fi", "주차장", "에어컨", "냉장고", "세탁기", "취사가능"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop&crop=center"
    ],
    checkIn: "16:00",
    checkOut: "10:00",
    policies: ["금연", "반려동물 가능", "파티 불가"],
    contact: "033-123-4567",
    address: "강원도 강릉시 해안로 456"
  },
  {
    id: 3,
    name: "부산 해운대 모던 호텔",
    location: "부산광역시 해운대구",
    price: 180000,
    capacity: 2,
    rating: 4.8,
    liked: false,
    description: "해운대 해변에서 도보 5분 거리에 위치한 모던한 디자인의 호텔입니다. 최고급 시설과 서비스를 제공합니다.",
    amenities: ["Wi-Fi", "발렛파킹", "에어컨", "미니바", "룸서비스", "피트니스"],
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center"
    ],
    checkIn: "15:00",
    checkOut: "12:00",
    policies: ["금연", "반려동물 불가", "파티 불가"],
    contact: "051-123-4567",
    address: "부산광역시 해운대구 해운대해변로 789"
  },
  {
    id: 4,
    name: "경주 한옥 스테이",
    location: "경상북도 경주시",
    price: 95000,
    capacity: 4,
    rating: 4.3,
    liked: false,
    description: "전통 한옥의 아름다움을 현대적 편의시설과 함께 경험할 수 있는 특별한 숙소입니다. 경주의 역사와 문화를 만끽하세요.",
    amenities: ["Wi-Fi", "주차장", "한방욕조", "마당", "전통차", "취사가능"],
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&crop=center"
    ],
    checkIn: "15:30",
    checkOut: "11:00",
    policies: ["금연", "반려동물 불가", "전통문화 체험 가능"],
    contact: "054-123-4567",
    address: "경상북도 경주시 황남대로 321"
  }
];

const fetchAccommodationById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const accommodation = sampleAccommodations.find(acc => acc.id === parseInt(id));
      if (accommodation) {
        resolve({ data: accommodation });
      } else {
        reject(new Error("숙소를 찾을 수 없습니다."));
      }
    }, 500);
  });
};

export default function AccommodationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const loadAccommodation = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchAccommodationById(id);
        setAccommodation(res.data);
        setLiked(res.data.liked);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch accommodation:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAccommodation();
    }
  }, [id]);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? accommodation.images.length - 1 : prev - 1
    );
  }, [accommodation?.images?.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === accommodation.images.length - 1 ? 0 : prev + 1
    );
  }, [accommodation?.images?.length]);

  const toggleLike = useCallback(() => {
    setLiked(!liked);
    // 실제로는 서버에 찜 상태를 저장하는 API 호출
  }, [liked]);

  const handleBooking = useCallback(() => {
    if (accommodation) {
      alert(`${accommodation.name} 예약을 진행합니다.`);
      // 실제 예약 페이지로 이동하는 로직
    }
  }, [accommodation]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

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

  if (loading) {
    return (
      <div className="detail-wrapper">
        <div className="loading" role="status" aria-live="polite">
          <div className="spinner"></div>
          <span>숙소 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-wrapper">
        <div className="error-message">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button 
            className="btn-retry"
            onClick={handleBack}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="detail-wrapper">
        <div className="no-results">
          <i className="bi bi-house-x me-2"></i>
          숙소 정보를 찾을 수 없습니다.
          <button 
            className="btn-retry"
            onClick={handleBack}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-wrapper">
      <header className="detail-header">
        <button 
          className="back-button"
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <i className="bi bi-arrow-left"></i>
          <span>목록으로</span>
        </button>
        
        <div className="header-actions">
          <button
            className={`like-button ${liked ? 'liked' : ''}`}
            onClick={toggleLike}
            aria-label={liked ? "찜 해제" : "찜하기"}
          >
            <i className={`bi ${liked ? "bi-heart-fill" : "bi-heart"}`}></i>
            <span>{liked ? "찜 해제" : "찜하기"}</span>
          </button>
        </div>
      </header>

      <div className="detail-content">
        <div className="image-gallery">
          <div className="main-image-container">
            <img
              src={accommodation.images[currentImageIndex]}
              alt={`${accommodation.name} 이미지 ${currentImageIndex + 1}`}
              className="main-image"
            />
            
            {accommodation.images.length > 1 && (
              <>
                <button 
                  className="image-nav prev"
                  onClick={handlePrevImage}
                  aria-label="이전 이미지"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                
                <button 
                  className="image-nav next"
                  onClick={handleNextImage}
                  aria-label="다음 이미지"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
                
                <div className="image-indicators">
                  {accommodation.images.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`${index + 1}번째 이미지 보기`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="detail-info">
          <div className="basic-info">
            <h1 className="accommodation-name">
              <i className="bi bi-building me-2"></i>
              {accommodation.name}
            </h1>
            
            <div className="location-rating">
              <p className="location">
                <i className="bi bi-geo-alt-fill me-1"></i>
                {accommodation.location}
              </p>
              <div className="rating">
                {renderStars(accommodation.rating)}
              </div>
            </div>

            <div className="price-capacity">
              <div className="price">
                <i className="bi bi-cash-coin me-1"></i>
                <span className="price-amount">{accommodation.price.toLocaleString()}원</span>
                <span className="price-unit"> / 1박</span>
              </div>
              <div className="capacity">
                <i className="bi bi-people-fill me-1"></i>
                최대 {accommodation.capacity}명
              </div>
            </div>
          </div>

          <div className="description-section">
            <h2><i className="bi bi-info-circle me-2"></i>숙소 소개</h2>
            <p className="description">{accommodation.description}</p>
          </div>

          <div className="amenities-section">
            <h2><i className="bi bi-check2-square me-2"></i>편의시설</h2>
            <div className="amenities-grid">
              {accommodation.amenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <div className="check-info-section">
            <h2><i className="bi bi-clock me-2"></i>체크인/체크아웃</h2>
            <div className="check-info">
              <div className="check-item">
                <span className="check-label">체크인:</span>
                <span className="check-time">{accommodation.checkIn}</span>
              </div>
              <div className="check-item">
                <span className="check-label">체크아웃:</span>
                <span className="check-time">{accommodation.checkOut}</span>
              </div>
            </div>
          </div>

          <div className="policies-section">
            <h2><i className="bi bi-shield-check me-2"></i>숙소 규정</h2>
            <ul className="policies-list">
              {accommodation.policies.map((policy, index) => (
                <li key={index} className="policy-item">
                  <i className="bi bi-dot me-1"></i>
                  {policy}
                </li>
              ))}
            </ul>
          </div>

          <div className="contact-section">
            <h2><i className="bi bi-telephone me-2"></i>연락처 및 위치</h2>
            <div className="contact-info">
              <div className="contact-item">
                <i className="bi bi-telephone-fill me-2"></i>
                <span>{accommodation.contact}</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-geo-alt-fill me-2"></i>
                <span>{accommodation.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-section">
        <div className="booking-container">
          <div className="booking-info">
            <div className="price-summary">
              <span className="total-price">{accommodation.price.toLocaleString()}원</span>
              <span className="price-per-night"> / 1박</span>
            </div>
          </div>
          
          <button 
            className="booking-button"
            onClick={handleBooking}
          >
            <i className="bi bi-calendar-check me-2"></i>
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
}