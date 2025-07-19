package com.example.TravelProject.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccommodationDTO {
	 
	// 숙소 ID
    private Integer accommodationId; 
 
    // 소유자(유저) ID
    private Integer ownerId;             

    // 숙소 이름
    private String name;
    
    // 숙소 설명
    private String description;         
 
    // 숙소 주소
    private String address;          
 
    // 위도
    private BigDecimal latitude;         
 
    // 경도
    private BigDecimal longitude;      
 
    // 숙소 유형 (호텔, 모텔, 펜션 등)
    private String type;               
 
    // 체크인 시간
    private LocalTime checkInTime;       
    
    // 체크아웃 시간
    private LocalTime checkOutTime;      
    
    // 평균 평점
    private BigDecimal ratingAvg;        
    
    // 총 리뷰 수
    private Integer totalReviews;        
 
    // 등록 일시
    private LocalDateTime registrationDate; 
    
    // 활성화 여부
    private Boolean isActive;          
}
