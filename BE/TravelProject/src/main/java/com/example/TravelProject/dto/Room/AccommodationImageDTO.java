package com.example.TravelProject.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccommodationImageDTO {
	
	// 이미지 고유 ID
    private Integer imageId;        
 
    // 숙소 ID
    private Integer accommodationId;  
 
    // 이미지 URL
    private String imageUrl;          
 
    // 이미지 설명 또는 캡션
    private String caption;          
    
    // 정렬 순서 (0 = 대표 이미지)
    private Integer orderNum;        
}
