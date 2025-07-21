package com.example.TravelProject.repository.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.room.AccommodationImage;

import java.util.List;

@Repository
public interface AccommodationImageRepository extends JpaRepository<AccommodationImage, Integer> {

    // 특정 숙소의 모든 이미지 조회 (등록 순서대로)
    List<AccommodationImage> findByAccommodation_AccommodationIdOrderByOrderNumAsc(Integer accommodationId);

    // 숙소의 대표 이미지 한 장만 가져오기
    AccommodationImage findFirstByAccommodation_AccommodationIdAndOrderNum(Integer accommodationId, Integer orderNum);

    // 숙소의 모든 이미지 삭제
    void deleteByAccommodation_AccommodationId(Integer accommodationId);
}
