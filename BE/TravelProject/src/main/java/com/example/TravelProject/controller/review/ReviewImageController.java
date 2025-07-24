package com.example.TravelProject.controller.review;

import com.example.TravelProject.entity.review.ReviewImage;
import com.example.TravelProject.service.Review.ReviewImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/review-images")
@RequiredArgsConstructor
public class ReviewImageController {

    private final ReviewImageService reviewImageService;

    // 리뷰 이미지 등록
    @PostMapping
    public ResponseEntity<ReviewImage> uploadReviewImage(@RequestBody ReviewImage reviewImage) {
        ReviewImage saved = reviewImageService.saveReviewImage(reviewImage);
        return ResponseEntity.ok(saved);
    }

    // 이미지 ID로 조회
    @GetMapping("/app")
    public ResponseEntity<ReviewImage> getImageById(@PathVariable Integer id) {
        return reviewImageService.getReviewImageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 리뷰 ID로 이미지 목록 조회
    @GetMapping("/app")
    public ResponseEntity<List<ReviewImage>> getImagesByReviewId(@PathVariable Integer reviewId) {
        return ResponseEntity.ok(reviewImageService.getImagesByReviewId(reviewId));
    }

    // 이미지 삭제
    @DeleteMapping("/app")
    public ResponseEntity<Void> deleteImage(@PathVariable Integer id) {
        reviewImageService.deleteReviewImage(id);
        return ResponseEntity.noContent().build();
    }
}
