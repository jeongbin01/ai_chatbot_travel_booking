//package com.example.TravelProject.repository.Coupon;
//
//import com.example.TravelProject.entity.coupon.Coupon;
//import com.example.TravelProject.entity.coupon.UserCoupon;
//import com.example.TravelProject.entity.useraccount.User;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface UserCouponRepository extends JpaRepository<UserCoupon, Integer> {
//
//	// 특정 사용자에게 발급된 전체 쿠폰 조회
//    List<UserCoupon> findByUser_UserId(Integer userId);
//
//    // 사용자 + 쿠폰 기준으로 단건 조회 (중복 방지 시 사용)
//    Optional<UserCoupon> findByUser_UserIdAndCoupon_CouponId(Integer userId, Integer couponId);
//
//    // 사용자에게 아직 사용하지 않은 쿠폰만 조회
//    List<UserCoupon> findByUser_UserIdAndIsUsedFalse(Integer userId);
//
//    // 예약에 사용된 쿠폰 조회
//    Optional<UserCoupon> findByBooking_BookingId(Integer bookingId);
//}
