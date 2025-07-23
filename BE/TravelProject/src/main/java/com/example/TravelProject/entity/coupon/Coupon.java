//package com.example.TravelProject.entity.coupon;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//
//@Entity
//@Table(name = "coupon")
//@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
//public class Coupon {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer couponId;
//
//    @ManyToOne
//    @JoinColumn(name = "promotion_id")
//    private Promotion promotion;
//
//    @Column(nullable = false, unique = true)
//    private String couponCode;
//
//    @Column(nullable = false)
//    private String name;
//
//    @Column(columnDefinition = "TEXT")
//    private String description;
//
//    private String discountType; // 정액 할인, 정률 할인
//
//    @Column(nullable = false)
//    private BigDecimal discountValue;
//    @Builder.Default
//    private BigDecimal minOrderAmount = BigDecimal.ZERO;
//
//    private BigDecimal maxDiscountAmount;
//
//    @Column(nullable = false)
//    private LocalDate issueStartDate;
//
//    @Column(nullable = false)
//    private LocalDate issueEndDate;
//
//    @Column(nullable = false)
//    private LocalDate validStartDate;
//
//    @Column(nullable = false)
//    private LocalDate validEndDate;
//
//    @Column(nullable = false)
//    private Integer totalQuantity;
//    @Builder.Default
//    private Integer issuedQuantity = 0;
//    @Builder.Default
//    private Integer usageLimitPerUser = 1;
//}