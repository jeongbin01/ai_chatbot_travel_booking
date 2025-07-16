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

    private Integer couponId;
    private Long promotionId; // Promotion 엔티티의 ID
    private String couponCode;
    private String name;
    private String description;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderAmount;
    private BigDecimal maxDiscountAmount;
    private LocalDate issueStartDate;
    private LocalDate issueEndDate;
    private LocalDate validStartDate;
    private LocalDate validEndDate;
    private Integer totalQuantity;
    private Integer issuedQuantity;
    private Integer usageLimitPerUser;

}
