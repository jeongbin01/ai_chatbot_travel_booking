package com.example.TravelProject.service.Room;

import com.example.TravelProject.entity.room.PricePolicy;
import com.example.TravelProject.repository.Room.PricePolicyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PricePolicyService {

    private final PricePolicyRepository pricePolicyRepository;

    // 모든 가격 정책 조회
    public List<PricePolicy> findAll() {
        return pricePolicyRepository.findAll();
    }

    // 가격 정책 ID로 조회
    public Optional<PricePolicy> findById(Integer id) {
        return pricePolicyRepository.findById(id);
    }

    // 가격 정책 저장 (등록 또는 수정)
    public PricePolicy save(PricePolicy pricePolicy) {
        return pricePolicyRepository.save(pricePolicy);
    }

    // 가격 정책 삭제
    public void deleteById(Integer id) {
        pricePolicyRepository.deleteById(id);
    }

    // 특정 객실 타입의 모든 가격 정책 조회
    public List<PricePolicy> findByRoomTypeId(Integer roomTypeId) {
        return pricePolicyRepository.findByRoomType_RoomTypeId(roomTypeId);
    }


    // 특정 날짜에 적용되는 가격 정책 조회 (예약용)
    public Optional<PricePolicy> findValidPolicyByRoomTypeAndDate(Integer roomTypeId, LocalDate targetDate) {
        return pricePolicyRepository.findFirstByRoomType_RoomTypeIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                roomTypeId, targetDate, targetDate
        );
    }


    // 등록하려는 기간과 겹치는 정책이 있는지 확인 (중복 등록 방지)
    public List<PricePolicy> findOverlappingPolicies(Integer roomTypeId, LocalDate startDate, LocalDate endDate) {
        return pricePolicyRepository.findByRoomType_RoomTypeIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                roomTypeId, endDate, startDate
        );
    }
}
