package com.example.TravelProject.controller.review;

import com.example.TravelProject.entity.review.ReviewImage;
import com.example.TravelProject.service.Review.ReviewImageService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/review-images")
@RequiredArgsConstructor
public class ReviewImageController {

    private final ReviewImageService reviewImageService;

    @Operation(
            summary = "리뷰 이미지 등록",
            description = """
                리뷰에 첨부할 이미지를 등록합니다.
                요청 본문에는 이미지 URL, 리뷰 ID 등의 정보가 포함되어야 합니다.
                """
        )
    // 리뷰 이미지 등록
    @PostMapping
    public ResponseEntity<ReviewImage> uploadReviewImage(@RequestBody ReviewImage reviewImage) {
        ReviewImage saved = reviewImageService.saveReviewImage(reviewImage);
        return ResponseEntity.ok(saved);
    }

    @Operation(
            summary = "리뷰 이미지 ID로 조회",
            description = """
                고유 이미지 ID를 기반으로 리뷰 이미지를 단건 조회합니다.
                존재하지 않을 경우 404 응답을 반환합니다.
                """
        )
    // 이미지 ID로 조회
    @GetMapping("/{id}")
    public ResponseEntity<ReviewImage> getImageById(@PathVariable Integer id) {
        return reviewImageService.getReviewImageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "리뷰 ID로 이미지 목록 조회",
            description = """
                리뷰 ID를 기준으로 해당 리뷰에 첨부된 모든 이미지 목록을 조회합니다.
                """
        )
    // 리뷰 ID로 이미지 목록 조회
    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<ReviewImage>> getImagesByReviewId(@PathVariable Integer reviewId) {
        return ResponseEntity.ok(reviewImageService.getImagesByReviewId(reviewId));
    }

    @Operation(
            summary = "리뷰 이미지 삭제",
            description = """
                이미지 ID를 기준으로 리뷰 이미지를 삭제합니다.
                삭제 성공 시 204 No Content 응답을 반환합니다.
                """
        )
    // 이미지 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Integer id) {
        reviewImageService.deleteReviewImage(id);
        return ResponseEntity.noContent().build();
    }
}
