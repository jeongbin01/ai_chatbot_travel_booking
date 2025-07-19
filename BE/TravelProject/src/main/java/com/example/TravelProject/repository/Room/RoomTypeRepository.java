package com.example.TravelProject.repository.Room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.TravelProject.entity.Room.RoomType;

import java.util.List;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {

    // 특정 숙소(accommodation)에 속한 모든 객실 타입 조회
    List<RoomType> findByAccommodation_AccommodationId(Integer accommodationId);

    // 숙소 ID와 객실 이름으로 조회 (중복 체크용)
    RoomType findByAccommodation_AccommodationIdAndName(Integer accommodationId, String name);

    // 숙소 ID로 조회 + 이름 키워드 포함 (검색 필터용)
    List<RoomType> findByAccommodation_AccommodationIdAndNameContaining(Integer accommodationId, String keyword);
}
