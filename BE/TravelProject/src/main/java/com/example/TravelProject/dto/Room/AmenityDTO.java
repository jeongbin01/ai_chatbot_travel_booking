package com.example.TravelProject.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmenityDTO {

	// 편의시설 ID
    private Integer amenityId;  

    // 편의시설 이름
    private String name;        
 
    // 아이콘 URL (예: 화장실, 주차장, 와이파이 등)
    private String iconUrl;     
}
