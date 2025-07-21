package com.example.TravelProject.repository.Coupon;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.coupon.Coupon;

import java.util.Optional;
import java.util.List;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Integer> {

	// 쿠폰 코드로 단일 쿠폰 조회
	Optional<Coupon> findByCouponCode(String couponCode);
	
	// 특정 프로모션 ID에 속한 쿠폰 목록 조회
	List<Coupon> findByPromotion_PromotionId(Integer promotionId);
	
	// 오늘 발급 가능한 쿠폰 조회 (발급 기간 내 쿠폰)
	List<Coupon> findByIssueStartDateBeforeAndIssueEndDateAfter(java.time.LocalDate now1, java.time.LocalDate now2);

	// 사용 가능 기간이 유효한 쿠폰 조회
	List<Coupon> findByValidStartDateBeforeAndValidEndDateAfter(java.time.LocalDate now1, java.time.LocalDate now2);

	}
