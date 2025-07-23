//package com.example.TravelProject.entity.coupon;
//
//
//import com.example.TravelProject.entity.booking.*;
//import com.example.TravelProject.entity.useraccount.User;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "user_coupon")
//@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
//public class UserCoupon {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer userCouponId;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;
//
//    @ManyToOne
//    @JoinColumn(name = "coupon_id", nullable = false)
//    private Coupon coupon;
//    @Builder.Default
//    private Boolean isUsed = false;
//
//    private LocalDateTime usedDate;
//
//    @ManyToOne
//    @JoinColumn(name = "booking_id")
//    private Booking booking;
//}
//
