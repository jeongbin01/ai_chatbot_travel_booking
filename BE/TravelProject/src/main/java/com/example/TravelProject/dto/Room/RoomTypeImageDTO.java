package com.example.TravelProject.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomTypeImageDTO {

	// 이미지 ID
    private Integer imageId;      
 
    // 객실 타입 ID
    private Integer roomTypeId;   
 
    // 이미지 URL
    private String imageUrl;      
 
    // 이미지 캡션 (설명)
    private String caption;       
 
    // 이미지 순서 (0: 대표 이미지)
    private Integer orderNum;      
}
