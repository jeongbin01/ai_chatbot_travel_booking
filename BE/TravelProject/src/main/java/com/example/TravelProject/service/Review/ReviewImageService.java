package com.example.TravelProject.service.review;

import com.example.TravelProject.entity.review.ReviewImage;
import com.example.TravelProject.repository.review.ReviewImageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewImageService {

    private final ReviewImageRepository reviewImageRepository;

    // 리뷰 이미지 저장
    public ReviewImage saveReviewImage(ReviewImage reviewImage) {
        return reviewImageRepository.save(reviewImage);
    }

    // 이미지 ID로 조회
    public Optional<ReviewImage> getReviewImageById(Integer imageId) {
        return reviewImageRepository.findById(imageId);
    }

    // 리뷰 ID로 모든 이미지 조회
    public List<ReviewImage> getImagesByReviewId(Integer reviewId) {
        return reviewImageRepository.findByReviewReviewId(reviewId);
    }

    // 이미지 삭제
    public void deleteReviewImage(Integer imageId) {
        reviewImageRepository.deleteById(imageId);
    }
}
