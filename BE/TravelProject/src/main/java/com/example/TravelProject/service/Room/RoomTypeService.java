package com.example.TravelProject.service.Room;

import com.example.TravelProject.entity.Room.RoomType;
import com.example.TravelProject.repository.Room.RoomTypeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    // 모든 객실 타입 조회
    public List<RoomType> findAll() {
        return roomTypeRepository.findAll();
    }

    // 객실 타입 ID로 단건 조회
    public Optional<RoomType> findById(Integer roomTypeId) {
        return roomTypeRepository.findById(roomTypeId);
    }

    // 객실 타입 저장 (등록 또는 수정)
    public RoomType save(RoomType roomType) {
        return roomTypeRepository.save(roomType);
    }

    // 객실 타입 삭제
    public void deleteById(Integer roomTypeId) {
        roomTypeRepository.deleteById(roomTypeId);
    }

    // 특정 숙소에 등록된 객실 타입 리스트 조회
    public List<RoomType> findByAccommodationId(Integer accommodationId) {
        return roomTypeRepository.findByAccommodation_AccommodationId(accommodationId);
    }

    // 숙소 ID와 객실 타입 이름으로 중복 확인
    public RoomType findByAccommodationIdAndName(Integer accommodationId, String name) {
        return roomTypeRepository.findByAccommodation_AccommodationIdAndName(accommodationId, name);
    }

    // 객실 타입 이름 검색 (부분 일치)
    public List<RoomType> searchByName(Integer accommodationId, String keyword) {
        return roomTypeRepository.findByAccommodation_AccommodationIdAndNameContaining(accommodationId, keyword);
    }

    public RoomType update(Integer roomTypeId, RoomType updatedRoomType) {
        return roomTypeRepository.findById(roomTypeId)
                .map(existing -> {
                    existing.setName(updatedRoomType.getName());
                    existing.setDescription(updatedRoomType.getDescription());
                    existing.setMaxOccupancy(updatedRoomType.getMaxOccupancy());
                    existing.setStandardOccupancy(updatedRoomType.getStandardOccupancy());
                    existing.setBedType(updatedRoomType.getBedType());
                    existing.setAreaSqm(updatedRoomType.getAreaSqm());
                    return roomTypeRepository.save(existing);
                })
                .orElseThrow(() -> new IllegalArgumentException("객실 타입을 찾을 수 없습니다. ID: " + roomTypeId));
    }

}
