package com.example.TravelProject.repository.Room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.room.PricePolicy;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PricePolicyRepository extends JpaRepository<PricePolicy, Integer> {

    // 특정 객실 타입에 대한 모든 가격 정책 조회
    List<PricePolicy> findByRoomType_RoomTypeId(Integer roomTypeId);

    // 특정 날짜에 해당하는 가격 정책 조회 (예약 시 가격 계산)
    Optional<PricePolicy> findFirstByRoomType_RoomTypeIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Integer roomTypeId, LocalDate targetDate1, LocalDate targetDate2
    );

    // 날짜 범위가 겹치는 정책들 조회 (중복 등록 방지용)
    List<PricePolicy> findByRoomType_RoomTypeIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Integer roomTypeId, LocalDate endDate, LocalDate startDate
    );
}
