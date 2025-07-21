package com.example.TravelProject.repository.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.room.RoomAmenity;

import java.util.List;

@Repository
public interface RoomAmenityRepository extends JpaRepository<RoomAmenity, Integer> {

    // 특정 객실 타입(RoomType)에 연결된 편의시설 전체 조회
    List<RoomAmenity> findByRoomType_RoomTypeId(Integer roomTypeId);

    // 특정 편의시설(Amenity)이 연결된 객실 타입들 조회
    List<RoomAmenity> findByAmenity_AmenityId(Integer amenityId);

    // 객실 타입과 편의시설 조합으로 중복 여부 확인
    boolean existsByRoomType_RoomTypeIdAndAmenity_AmenityId(Integer roomTypeId, Integer amenityId);

    // 객실 타입에서 특정 편의시설 연결 제거
    void deleteByRoomType_RoomTypeIdAndAmenity_AmenityId(Integer roomTypeId, Integer amenityId);
}
