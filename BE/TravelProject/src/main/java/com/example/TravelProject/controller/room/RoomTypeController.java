package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.RoomType;
import com.example.TravelProject.service.Room.RoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/room-types")
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    // 전체 RoomType 조회
    @GetMapping
    public List<RoomType> findAll() {
        return roomTypeService.findAll();
    }

    // RoomType 단건 조회
    @GetMapping("/{roomTypeId}")
    public Optional<RoomType> findById(@PathVariable Integer roomTypeId) {
        return roomTypeService.findById(roomTypeId);
    }

    // RoomType 등록
    @PostMapping
    public RoomType create(@RequestBody RoomType roomType) {
        return roomTypeService.save(roomType);
    }

    // RoomType 수정
    @PutMapping("/{roomTypeId}")
    public RoomType update(@PathVariable Integer roomTypeId, @RequestBody RoomType updatedRoomType) {
        return roomTypeService.update(roomTypeId, updatedRoomType);
    }

    // RoomType 삭제
    @DeleteMapping("/{roomTypeId}")
    public void delete(@PathVariable Integer roomTypeId) {
        roomTypeService.deleteById(roomTypeId);
    }
}
