package com.example.TravelProject.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDTO {

	// 객실 ID
    private Integer roomId;        
 
    // 객실 타입 ID
    private Integer roomTypeId;     
 
    // 객실 번호 (예: 101호, A203 등)
    private String roomNumber;      
 
    // 예약 가능 여부
    private Boolean isAvailable;    
}
