package com.example.TravelProject.repository.Coupon;

import com.example.TravelProject.entity.Coupon.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {

	// 프로모션 이름으로 단건 조회
    Optional<Promotion> findByName(String name);

    // 특정 날짜 기준으로 진행 중인 프로모션 목록 조회
    List<Promotion> findByStartDateBeforeAndEndDateAfter(LocalDate now1, LocalDate now2);

    // 상태(활성/비활성) 기준으로 조회
    List<Promotion> findByStatus(String status);

    // 종료된 프로모션 목록 조회
    List<Promotion> findByEndDateBefore(LocalDate today);
}
