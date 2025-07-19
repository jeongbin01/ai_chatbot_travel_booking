package com.example.TravelProject.repository.Review;

import com.example.TravelProject.entity.Review.ReviewImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewImageRepository extends JpaRepository<ReviewImage, Integer> {

    // 특정 리뷰에 속한 이미지 목록 조회
    List<ReviewImage> findByReviewReviewId(Integer reviewId);

}
