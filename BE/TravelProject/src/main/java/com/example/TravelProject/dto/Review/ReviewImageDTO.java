package com.example.TravelProject.dto.Review;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewImageDTO {

	// 이미지 고유 ID
    private Integer imageId;      

    // 연결된 리뷰 ID
    private Integer reviewId;   

    // 이미지 파일 URL
    private String imageUrl; 

 
    // 이미지 캡션 (설명)
    private String caption;     
}
