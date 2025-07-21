package com.example.TravelProject.dto.Coupon;

import com.example.TravelProject.dto.Booking.BookingDTO;
import com.example.TravelProject.dto.Coupon.CouponDTO;
import com.example.TravelProject.entity.useraccount.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCouponDTO {
	
	// 유저 쿠폰 ID
	private Integer userCouponId;

	// 쿠폰을 보유한 사용자 정보
    private User user;

    // 사용자 보유한 쿠폰 정보
    private CouponDTO coupon;

    // 쿠폰 사용한 여부
    @Builder.Default
    private Boolean isUsed = false;

    // 쿠폰이 사용된 날짜 및 시간
    private LocalDateTime usedDate;

    // 쿠폰이 사용된 예약 정보
    private BookingDTO booking;
}
