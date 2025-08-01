package com.example.TravelProject.controller.review;

import com.example.TravelProject.entity.review.Review;
import com.example.TravelProject.service.Review.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(
            summary = "리뷰 등록",
            description = """
                새로운 리뷰를 등록합니다.
                요청 본문에는 리뷰 내용, 작성자, 숙소 ID 등의 정보가 포함되어야 합니다.
                """
        )
    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        Review saved = reviewService.createReview(review);
        return ResponseEntity.ok(saved);
    }

    @Operation(
            summary = "리뷰 ID로 조회",
            description = """
                리뷰의 고유 ID를 이용해 단일 리뷰를 조회합니다.
                존재하지 않는 경우 404 Not Found 응답을 반환합니다.
                """
        )
    // 리뷰 ID로 조회
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable("id") Integer id) {
        return reviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(
            summary = "전체 리뷰 조회",
            description = """
                등록된 모든 리뷰 목록을 반환합니다.
                관리자 또는 유저가 전체 리뷰 리스트를 확인할 때 사용됩니다.
                """
        )
    // 전체 리뷰 조회
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @Operation(
            summary = "리뷰 삭제",
            description = """
                리뷰의 ID를 기준으로 해당 리뷰를 삭제합니다.
                성공 시 204 No Content 응답을 반환합니다.
                """
        )
    // 리뷰 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable("id") Integer id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "리뷰 승인 처리",
            description = """
                관리자가 리뷰를 승인할 때 사용하는 API입니다.
                승인되면 해당 리뷰의 상태가 변경됩니다.
                """
        )
    // 리뷰 승인
    @PatchMapping("/{id}/approve")
    public ResponseEntity<Review> approveReview(@PathVariable("id") Integer id) {
        Review approved = reviewService.approveReview(id);
        return ResponseEntity.ok(approved);
    }

    @Operation(
            summary = "도움돼요 카운트 증가",
            description = """
                사용자가 리뷰에 '도움이 돼요' 버튼을 눌렀을 때 호출하는 API입니다.
                해당 리뷰의 helpfulCount가 1 증가합니다.
                """
        )
    // 도움돼요 카운트 증가
    @PatchMapping("/{id}/helpful")
    public ResponseEntity<Review> increaseHelpful(@PathVariable("id") Integer id) {
        Review updated = reviewService.increaseHelpfulCount(id);
        return ResponseEntity.ok(updated);
    }
}
