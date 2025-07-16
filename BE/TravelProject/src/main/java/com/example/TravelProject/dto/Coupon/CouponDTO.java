package com.example.TravelProject.dto.Coupon;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponDTO {
	
	// 쿠폰 ID
    private Integer couponId;
    
    // 연결한 프로모션 ID
    private Long promotionId; // Promotion 엔티티의 ID
    
    // 쿠폰 코드
    private String couponCode;
    
    // 쿠폰 이름
    private String name;
   
    // 쿠폰 설명
    private String description;
    
    // 할인 유형("정액", "퍼센트")
    private String discountType;
    
    //할인 값
    private BigDecimal discountValue;
    
    // 최소 주문 금액
    private BigDecimal minOrderAmount;
    
    // 최대 주문 금액
    private BigDecimal maxDiscountAmount;
    
    // 쿠폰 발급 시작일
    private LocalDate issueStartDate;
    
    // 쿠폰 발급 종료일
    private LocalDate issueEndDate;
    
    // 쿠폰 사용 시작일
    private LocalDate validStartDate;
    
    // 쿠폰 사용 종료일
    private LocalDate validEndDate;
    
    // 전체 발급 수량 제한(unLL or 0이면 무제한)
    private Integer totalQuantity;
    
    // 현재까지 발급된 수량
    private Integer issuedQuantity;
    
    // 사용자당 최대 사용 가능 횟수
    private Integer usageLimitPerUser;

}
