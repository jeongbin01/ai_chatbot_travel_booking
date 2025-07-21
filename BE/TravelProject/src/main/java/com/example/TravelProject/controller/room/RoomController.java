package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.Room;
import com.example.TravelProject.service.Room.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")  // URL Prefix 설정
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    // 전체 객실 조회
    @GetMapping
    public List<Room> findAllRooms() {
        return roomService.findAll();
    }

    // 객실 ID로 단건 조회
    @GetMapping("/{roomId}")
    public Optional<Room> findRoomById(@PathVariable Integer roomId) {
        return roomService.findById(roomId);
    }

    // 객실 생성
    @PostMapping
    public Room createRoom(@RequestBody Room room) {
        return roomService.save(room);
    }

    // 객실 정보 수정
    @PutMapping("/{roomId}")
    public Room updateRoom(@PathVariable Integer roomId, @RequestBody Room updatedRoom) {
        return roomService.update(roomId, updatedRoom);
    }

    // 객실 삭제
    @DeleteMapping("/{roomId}")
    public void deleteRoom(@PathVariable Integer roomId) {
        roomService.deleteById(roomId);
    }
}
