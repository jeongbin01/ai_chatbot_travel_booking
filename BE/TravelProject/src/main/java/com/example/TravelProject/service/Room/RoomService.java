package com.example.TravelProject.service.Room;

import com.example.TravelProject.entity.Room.Room;
import com.example.TravelProject.repository.Room.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomService {

    private final RoomRepository roomRepository;

    // 모든 객실 조회
    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    // 객실 ID로 조회
    public Optional<Room> findById(Integer roomId) {
        return roomRepository.findById(roomId);
    }

    // 객실 저장 (등록 또는 수정)
    public Room save(Room room) {
        return roomRepository.save(room);
    }

    // 객실 ID로 삭제
    public void deleteById(Integer roomId) {
        roomRepository.deleteById(roomId);
    }

    // 특정 객실 타입 ID로 객실 목록 조회
    public List<Room> findByRoomTypeId(Integer roomTypeId) {
        return roomRepository.findByRoomType_RoomTypeId(roomTypeId);
    }

    // 객실 번호로 단건 조회 (중복 확인용)
    public Room findByRoomNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber);
    }

    // 사용 가능 여부로 필터링된 객실 조회
    public List<Room> findByAvailability(boolean isAvailable) {
        return roomRepository.findByIsAvailable(isAvailable);
    }

    // 특정 객실 타입에서 사용 가능한 객실만 조회
    public List<Room> findAvailableByRoomType(Integer roomTypeId) {
        return roomRepository.findByRoomType_RoomTypeIdAndIsAvailable(roomTypeId, true);
    }
}
