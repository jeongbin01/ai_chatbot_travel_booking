package com.example.TravelProject.dto.Review;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
	// 리뷰 고유 ID
    private Integer reviewId;

    // 사용자 ID
    private Integer userId;               
    		
    // 숙소 ID
    private Integer accommodationId;      
    
    // 여행상품 ID
    private Integer productId;            
    
    // 예약 ID
    private Integer bookingId;          

    // 별점 (1~5점)
    private Integer rating;               
    
    // 리뷰 본문
    private String comment;              

    // 작성일 
    private LocalDateTime reviewDate;  
    
    // 승인 여부
    private Boolean isApproved;         
    
    // "도움돼요" 수
    private Integer helpfulCount;       
}