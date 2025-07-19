package com.example.TravelProject.repository.Room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Room.AccommodationAmenity;

import java.util.List;

@Repository
public interface AccommodationAmenityRepository extends JpaRepository<AccommodationAmenity, Integer> {

    // 특정 숙소에 등록된 모든 편의시설 조회
    List<AccommodationAmenity> findByAccommodation_AccommodationId(Integer accommodationId);

    // 특정 편의시설이 연결된 숙소들 조회
    List<AccommodationAmenity> findByAmenity_AmenityId(Integer amenityId);

    // 숙소 ID와 편의시설 ID로 단건 조회 (중복 등록 방지용)
    boolean existsByAccommodation_AccommodationIdAndAmenity_AmenityId(Integer accommodationId, Integer amenityId);

    // 숙소에 연결된 특정 편의시설 삭제용
    void deleteByAccommodation_AccommodationIdAndAmenity_AmenityId(Integer accommodationId, Integer amenityId);
}
