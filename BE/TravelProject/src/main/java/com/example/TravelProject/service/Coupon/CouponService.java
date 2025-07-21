package com.example.TravelProject.service.coupon;

import com.example.TravelProject.entity.coupon.Coupon;
import com.example.TravelProject.repository.coupon.CouponRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CouponService {

	private final CouponRepository  couponRepository;
	
	// 전체 쿠폰 목록 조회
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    // 쿠폰 ID로 단건 조회
    public Optional<Coupon> getCouponById(Integer couponId) {
        return couponRepository.findById(couponId);
    }

    // 쿠폰 코드로 조회
    public Optional<Coupon> getCouponByCode(String couponCode) {
        return couponRepository.findByCouponCode(couponCode);
    }

    // 쿠폰 저장 (등록/수정)
    public Coupon saveCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    // 쿠폰 삭제
    public void deleteCoupon(Integer couponId) {
        couponRepository.deleteById(couponId);
    }

    // 현재 발급 가능한 쿠폰 목록
    public List<Coupon> getAvailableCoupons() {
        return couponRepository.findByIssueStartDateBeforeAndIssueEndDateAfter(
            java.time.LocalDate.now(), java.time.LocalDate.now()
        );
    }

}