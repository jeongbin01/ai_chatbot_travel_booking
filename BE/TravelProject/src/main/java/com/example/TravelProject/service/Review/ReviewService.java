package com.example.TravelProject.service.Review;

import com.example.TravelProject.entity.Review.Review;
import com.example.TravelProject.repository.Review.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // 리뷰 등록/수정
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    // ID로 리뷰 조회
    public Optional<Review> getReviewById(Integer reviewId) {
        return reviewRepository.findById(reviewId);
    }

    // 전체 리뷰 조회
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // 리뷰 삭제
    public void deleteReview(Integer reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    // 리뷰 승인 처리
    public Review approveReview(Integer reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));
        review.setIsApproved(true);
        return reviewRepository.save(review);
    }

    // 도움돼요 수 증가
    public Review increaseHelpfulCount(Integer reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));
        review.setHelpfulCount(review.getHelpfulCount() + 1);
        return reviewRepository.save(review);
    }
}
