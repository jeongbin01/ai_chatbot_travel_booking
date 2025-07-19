package com.example.TravelProject.service.Room;

import com.example.TravelProject.entity.Room.RoomTypeImage;
import com.example.TravelProject.repository.Room.RoomTypeImageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomTypeImageService {

    private final RoomTypeImageRepository roomTypeImageRepository;

    // 특정 객실 타입 ID에 대한 이미지 목록 조회 (orderNum 순 정렬)
    public List<RoomTypeImage> findImagesByRoomTypeId(Integer roomTypeId) {
        return roomTypeImageRepository.findByRoomType_RoomTypeIdOrderByOrderNumAsc(roomTypeId);
    }

    // 특정 객실 타입의 대표 이미지 조회 (orderNum == 0)
    public RoomTypeImage findThumbnail(Integer roomTypeId) {
        return roomTypeImageRepository.findFirstByRoomType_RoomTypeIdAndOrderNum(roomTypeId, 0);
    }

    // 객실 타입 이미지 저장
    public RoomTypeImage save(RoomTypeImage image) {
        return roomTypeImageRepository.save(image);
    }

    // 특정 이미지 ID로 삭제
    public void deleteById(Integer imageId) {
        roomTypeImageRepository.deleteById(imageId);
    }

    // 특정 객실 타입의 모든 이미지 삭제
    public void deleteAllByRoomTypeId(Integer roomTypeId) {
        roomTypeImageRepository.deleteByRoomType_RoomTypeId(roomTypeId);
    }

    // 이미지 ID로 단건 조회
    public Optional<RoomTypeImage> findById(Integer imageId) {
        return roomTypeImageRepository.findById(imageId);
    }
}
