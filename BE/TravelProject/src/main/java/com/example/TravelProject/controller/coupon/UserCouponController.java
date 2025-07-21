package com.example.TravelProject.controller.coupon;

import com.example.TravelProject.entity.coupon.UserCoupon;
import com.example.TravelProject.service.coupon.UserCouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-coupons")
@RequiredArgsConstructor
public class UserCouponController {

    private final UserCouponService userCouponService;

    // 사용자 ID로 전체 쿠폰 조회
    @GetMapping("/user/{userId}")
    public List<UserCoupon> getUserCoupons(@PathVariable Integer userId) {
        return userCouponService.getCouponsByUserId(userId);
    }

    // 사용자 ID로 사용 가능한 쿠폰 조회
    @GetMapping("/user/{userId}/available")
    public List<UserCoupon> getAvailableUserCoupons(@PathVariable Integer userId) {
        return userCouponService.getUsableCoupons(userId);
    }

    // 특정 사용자와 쿠폰 ID로 발급 여부 확인
    @GetMapping("/check")
    public ResponseEntity<UserCoupon> checkUserCoupon(
            @RequestParam Integer userId,
            @RequestParam Integer couponId) {
        Optional<UserCoupon> result = userCouponService.getUserCoupon(userId, couponId);
        return result.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    // UserCoupon 직접 등록 (관리자)
    @PostMapping
    public ResponseEntity<UserCoupon> issueUserCoupon(@RequestBody UserCoupon userCoupon) {
        return ResponseEntity.ok(userCouponService.saveUserCoupon(userCoupon));
    }

    // 쿠폰 사용 처리
    @PatchMapping("/{userCouponId}/use")
    public ResponseEntity<Void> useCoupon(@PathVariable Integer userCouponId) {
        userCouponService.useCoupon(userCouponId);
        return ResponseEntity.ok().build();
    }
}