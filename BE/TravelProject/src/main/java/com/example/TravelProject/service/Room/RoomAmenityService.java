package com.example.TravelProject.service.Room;

import com.example.TravelProject.entity.Room.RoomAmenity;
import com.example.TravelProject.repository.Room.RoomAmenityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomAmenityService {

    private final RoomAmenityRepository roomAmenityRepository;

    // 전체 RoomAmenity 조회
    public List<RoomAmenity> findAll() {
        return roomAmenityRepository.findAll();
    }

    // ID로 단건 조회 (필요 시)
    public RoomAmenity findById(Integer id) {
        return roomAmenityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RoomAmenity not found with id: " + id));
    }

    // ID로 삭제
    public void deleteById(Integer id) {
        roomAmenityRepository.deleteById(id);
    }

    // 특정 객실 타입 ID로 편의시설 리스트 조회
    public List<RoomAmenity> findByRoomTypeId(Integer roomTypeId) {
        return roomAmenityRepository.findByRoomType_RoomTypeId(roomTypeId);
    }

    // 특정 편의시설 ID로 연결된 객실 타입 리스트 조회
    public List<RoomAmenity> findByAmenityId(Integer amenityId) {
        return roomAmenityRepository.findByAmenity_AmenityId(amenityId);
    }

    // 객실 타입과 편의시설 ID 조합으로 존재 여부 확인 (중복 방지)
    public boolean exists(Integer roomTypeId, Integer amenityId) {
        return roomAmenityRepository.existsByRoomType_RoomTypeIdAndAmenity_AmenityId(roomTypeId, amenityId);
    }

    // 객실 타입에 편의시설 등록
    public RoomAmenity save(RoomAmenity roomAmenity) {
        return roomAmenityRepository.save(roomAmenity);
    }

    // 객실 타입에서 특정 편의시설 삭제
    public void deleteByRoomTypeAndAmenity(Integer roomTypeId, Integer amenityId) {
        roomAmenityRepository.deleteByRoomType_RoomTypeIdAndAmenity_AmenityId(roomTypeId, amenityId);
    }
}
