package com.example.TravelProject.repository.Room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.TravelProject.entity.Room.RoomTypeImage;

import java.util.List;

@Repository
public interface RoomTypeImageRepository extends JpaRepository<RoomTypeImage, Integer> {

    // 특정 객실 타입의 모든 이미지 조회 (정렬 순서대로)
    List<RoomTypeImage> findByRoomType_RoomTypeIdOrderByOrderNumAsc(Integer roomTypeId);

    // 특정 객실 타입의 대표 이미지(순서 0)만 조회
    RoomTypeImage findFirstByRoomType_RoomTypeIdAndOrderNum(Integer roomTypeId, Integer orderNum);

    // 객실 타입 ID로 이미지 전체 삭제 (객실 타입 삭제 시 함께 제거)
    void deleteByRoomType_RoomTypeId(Integer roomTypeId);
}
