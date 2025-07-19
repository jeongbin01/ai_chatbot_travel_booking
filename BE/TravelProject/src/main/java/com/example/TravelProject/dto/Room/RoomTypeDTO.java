package com.example.TravelProject.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomTypeDTO {

	// 객실 타입 ID
    private Integer roomTypeId;        
 
    // 숙소 ID
    private Integer accommodationId;   
 
    // 객실 이름 (예: 스탠다드룸)
    private String name;              
    
    // 객실 설명
    private String description;       
    
    // 최대 수용 인원
    private Integer maxOccupancy;     
 
    // 기준 인원
    private Integer standardOccupancy; 
 
    // 침대 타입 (예: 더블, 트윈)
    private String bedType;            
 
    // 객실 면적 (제곱미터)
    private BigDecimal areaSqm;        
}
