// ReviewCardSlider.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react'
import '../../styles/components/ReviewSlider.css'

const sampleReviews = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.8,
    title: '모두투어덕분에 남편과 가족 모두 호주 여행 준비부터 돌아오기까지 넘 행복하고 소중한 시간이었어요. 무엇보다는 검...',
    location: '[올패키지] [0424출발/소형차일정] [출국/입국 ★ 4.8점 ] 호주 7일',
  },
  // ... 이하 생략
]

const ReviewCardSlider = () => {
  const containerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    setCanScrollLeft(c.scrollLeft > 0)
    setCanScrollRight(c.scrollLeft < c.scrollWidth - c.clientWidth - 1)
  }, [])

  const scroll = useCallback((dir) => {
    const c = containerRef.current
    if (!c) return
    const scrollAmount = 320 * dir
    c.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }, [])

  const renderStars = useCallback((rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating)
      return (
        <i
          key={i}
          className={`bi ${filled ? 'bi-star-fill' : 'bi-star'}`}
          style={{ fontSize: '14px', marginRight: '2px' }}
        />
      )
    })
  }, [])

  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    c.addEventListener('scroll', updateScrollState)
    updateScrollState()
    return () => c.removeEventListener('scroll', updateScrollState)
  }, [updateScrollState])

  return (
    <section className="review-section">
      <div className="review-header">
        <h2 className="review-title">100% 실제 고객 리뷰 📝</h2>
      </div>

      <div className="slider-container">
        <button
          className={`nav-btn prev-btn ${!canScrollLeft ? 'disabled' : ''}`}
          onClick={() => scroll(-1)}
          disabled={!canScrollLeft}
        >
          <i className="bi bi-chevron-left" />
        </button>

        <div className="reviews-wrapper" ref={containerRef}>
          {sampleReviews.map((r) => (
            <div key={r.id} className="review-card">
              <div className="card-image">
                <img src={r.src} alt="리뷰 이미지" />
              </div>
              <div className="card-content">
                <div className="rating-row">
                  <div className="stars">{renderStars(r.rating)}</div>
                </div>
                <p className="review-text">{r.title}</p>
                <div className="review-meta">
                  <span className="location-info">{r.location}</span>
                  <div className="rating-info">
                    <i className="bi bi-star-fill" /> {r.rating}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className={`nav-btn next-btn ${!canScrollRight ? 'disabled' : ''}`}
          onClick={() => scroll(1)}
          disabled={!canScrollRight}
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </section>
  )
}

export default ReviewCardSlider
