package com.example.TravelProject.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomAmenityDTO {

	// 매핑 ID (RoomAmenity PK)
    private Integer id;             
 
    // 객실 타입 ID
    private Integer roomTypeId;     
 
    // 편의시설 ID
    private Integer amenityId;      
    
    // 편의시설 이름 (선택적 응답용)
    private String amenityName;    
}
