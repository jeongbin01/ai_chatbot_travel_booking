//package com.example.TravelProject.controller.coupon;
//
//import com.example.TravelProject.entity.coupon.Coupon;
//import com.example.TravelProject.service.Coupon.CouponService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/coupons")
//@RequiredArgsConstructor
//public class CouponController {
//
//    private final CouponService couponService;
//
//    // 전체 쿠폰 조회
//    @GetMapping
//    public List<Coupon> getAllCoupons() {
//        return couponService.getAllCoupons();
//    }
//
//    // ID로 쿠폰 조회
//    @GetMapping("/{id}")
//    public ResponseEntity<Coupon> getCouponById(@PathVariable Integer id) {
//        return couponService.getCouponById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//
//    // 쿠폰 코드로 조회
//    @GetMapping("/code/{couponCode}")
//    public ResponseEntity<Coupon> getCouponByCode(@PathVariable String couponCode) {
//        return couponService.getCouponByCode(couponCode)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//
//    // 쿠폰 등록
//    @PostMapping
//    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
//        return ResponseEntity.ok(couponService.saveCoupon(coupon));
//    }
//
//    // 쿠폰 삭제
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteCoupon(@PathVariable Integer id) {
//        couponService.deleteCoupon(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    // 현재 발급 가능한 쿠폰 목록 조회
//    @GetMapping("/available")
//    public List<Coupon> getAvailableCoupons() {
//        return couponService.getAvailableCoupons();
//    }
//}
