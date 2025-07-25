package com.example.TravelProject.repository.TravelProduct;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Travelproduct.ProductSchedule;
import com.example.TravelProject.entity.Travelproduct.TravelProduct;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductScheduleRepository extends JpaRepository<ProductSchedule, Integer> {
    // 기본 조회 (정렬 없음)
    List<ProductSchedule> findByProduct(TravelProduct product);
    // 오늘 이후 출발 일정
    List<ProductSchedule> findByDepartureDateAfter(LocalDate date);
    // 상품별 출발일 오름차순
    List<ProductSchedule> findByProductOrderByDepartureDateAsc(TravelProduct product);
}
