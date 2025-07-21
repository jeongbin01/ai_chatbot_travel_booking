package com.example.TravelProject.repository.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.room.Room;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {

    // 특정 객실 타입에 속한 모든 객실 조회
    List<Room> findByRoomType_RoomTypeId(Integer roomTypeId);

    // 사용 가능 여부(isAvailable)로 객실 조회
    List<Room> findByIsAvailable(Boolean isAvailable);

    // 특정 객실 타입 중 사용 가능한 객실만 조회
    List<Room> findByRoomType_RoomTypeIdAndIsAvailable(Integer roomTypeId, Boolean isAvailable);

    // 객실 번호로 단건 조회 (중복 등록 체크 )
    Room findByRoomNumber(String roomNumber);
}
