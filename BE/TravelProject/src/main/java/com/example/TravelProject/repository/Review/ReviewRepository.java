package com.example.TravelProject.repository.Review;

import com.example.TravelProject.entity.Review.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    // 유저 ID로 리뷰 조회
    List<Review> findByUserUserId(Integer userId);

    // 숙소 ID로 리뷰 조회
    List<Review> findByAccommodationAccommodationId(Integer accommodationId);

    // 여행상품 ID로 리뷰 조회
    List<Review> findByProductProductId(Integer productId);

    // 예약 ID로 리뷰 조회
    List<Review> findByBookingBookingId(Integer bookingId);

    // 승인된 리뷰만
    List<Review> findByIsApprovedTrue();

    // 도움돼요가 많은 순
    List<Review> findAllByOrderByHelpfulCountDesc();

    // 작성일 최신순
    List<Review> findAllByOrderByReviewDateDesc();
}
