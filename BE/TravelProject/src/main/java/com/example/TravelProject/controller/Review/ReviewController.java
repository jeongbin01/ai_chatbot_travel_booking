package com.example.TravelProject.controller.Review;

import com.example.TravelProject.entity.Review.Review;
import com.example.TravelProject.service.Review.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 등록
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        Review saved = reviewService.createReview(review);
        return ResponseEntity.ok(saved);
    }

    // 리뷰 ID로 조회
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Integer id) {
        return reviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 전체 리뷰 조회
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // 리뷰 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Integer id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    // 리뷰 승인
    @PatchMapping("/{id}/approve")
    public ResponseEntity<Review> approveReview(@PathVariable Integer id) {
        Review approved = reviewService.approveReview(id);
        return ResponseEntity.ok(approved);
    }

    // 도움돼요 카운트 증가
    @PatchMapping("/{id}/helpful")
    public ResponseEntity<Review> increaseHelpful(@PathVariable Integer id) {
        Review updated = reviewService.increaseHelpfulCount(id);
        return ResponseEntity.ok(updated);
    }
}
