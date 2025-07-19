package com.example.TravelProject.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PricePolicyDTO {
	  
	// 가격 정책 ID
    private Integer pricePolicyId;             
    
    // 객실 타입 ID
    private Integer roomTypeId;                 
    
    // 정책 시작일
    private LocalDate startDate;                
 
    // 정책 종료일
    private LocalDate endDate;                  
    
    // 기본 가격
    private BigDecimal basePrice;               

    // 추가 인원 요금
    private BigDecimal additionalPersonSurcharge;
    
    // 주말 요금
    private BigDecimal weekendSurcharge;       
 
    // 공휴일 요금
    private BigDecimal holidaySurcharge;         
}
