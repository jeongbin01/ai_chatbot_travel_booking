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
public class PromotionDTO {
	
	// 프로모션 ID
	private Integer promotionId;

	// 프로모션 이름(할인 이벤트)
    private String name;

    // 프로모션 설명(상세 내용, 제한 조건)
    private String description;

    // 프로모션 시작 날짜
    private LocalDate startDate;

    // 프로모션 종료 날짜
    private LocalDate endDate;

    // 대상 유형 ('전체', '신규 회원', 'VIP 고객')
    private String targetType;

    //할인 유형 (예: '정액 할인', '퍼센트 할인')
    private String discountType;

    // 할인 값(정액 할인 금액 or 퍼센트 비율)
    private BigDecimal discountValue;

    // 최대 할인 금액 (퍼센트 할인 시 한도 설정)
    private BigDecimal minOrderAmount;

    //프로모션 이미지 URL (배너 등 시각적 요소)
    private BigDecimal maxDiscountAmount;

    //프로모션 이미지 URL (배너 등 시각적 요소)
    private String imageUrl;

    private String status; // 활성 / 비활성
}
