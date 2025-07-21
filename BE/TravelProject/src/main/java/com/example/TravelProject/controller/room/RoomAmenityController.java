package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.RoomAmenity;
import com.example.TravelProject.service.room.RoomAmenityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-amenities")  // 엔드포인트 URL prefix
@RequiredArgsConstructor
public class RoomAmenityController {

    private final RoomAmenityService roomAmenityService;

    // 모든 객실 편의시설 매핑 조회
    @GetMapping
    public List<RoomAmenity> getAllRoomAmenities() {
        return roomAmenityService.findAll();
    }

    // 특정 RoomAmenity ID로 조회
    @GetMapping("/{id}")
    public RoomAmenity getRoomAmenityById(@PathVariable Integer id) {
        return roomAmenityService.findById(id);
    }

    // 객실 편의시설 매핑 등록
    @PostMapping
    public RoomAmenity createRoomAmenity(@RequestBody RoomAmenity roomAmenity) {
        return roomAmenityService.save(roomAmenity);
    }

    // 객실 편의시설 매핑 삭제
    @DeleteMapping("/{id}")
    public void deleteRoomAmenity(@PathVariable Integer id) {
        roomAmenityService.deleteById(id);
    }
}
