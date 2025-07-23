//package com.example.TravelProject.service.Coupon;
//
//import com.example.TravelProject.entity.coupon.UserCoupon;
//import com.example.TravelProject.repository.Coupon.UserCouponRepository;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class UserCouponService {
//
//    private final UserCouponRepository userCouponRepository;
//
//    // 특정 사용자에게 발급된 쿠폰 전체 조회
//    public List<UserCoupon> getCouponsByUserId(Integer userId) {
//        return userCouponRepository.findByUser_UserId(userId);
//    }
//
//    // 특정 쿠폰이 사용자에게 발급되었는지 확인
//    public Optional<UserCoupon> getUserCoupon(Integer userId, Integer couponId) {
//        return userCouponRepository.findByUser_UserIdAndCoupon_CouponId(userId, couponId);
//    }
//
//    // 아직 사용하지 않은 쿠폰 조회
//    public List<UserCoupon> getUsableCoupons(Integer userId) {
//        return userCouponRepository.findByUser_UserIdAndIsUsedFalse(userId);
//    }
//
//    // 예약에 사용된 쿠폰 조회
//    public Optional<UserCoupon> getCouponByBookingId(Integer bookingId) {
//        return userCouponRepository.findByBooking_BookingId(bookingId);
//    }
//
//    // 쿠폰 저장
//    public UserCoupon saveUserCoupon(UserCoupon userCoupon) {
//        return userCouponRepository.save(userCoupon);
//    }
//
//    // 쿠폰 사용 처리
//    public void useCoupon(Integer userCouponId) {
//        UserCoupon userCoupon = userCouponRepository.findById(userCouponId)
//                .orElseThrow(() -> new IllegalArgumentException("해당 쿠폰을 찾을 수 없습니다."));
//
//        if (userCoupon.getIsUsed() != null && userCoupon.getIsUsed()) {
//            throw new IllegalStateException("이미 사용된 쿠폰입니다.");
//        }
//
//        userCoupon.setIsUsed(true);
//        userCoupon.setUsedDate(LocalDateTime.now());
//
//        userCouponRepository.save(userCoupon);
//    }
//}
