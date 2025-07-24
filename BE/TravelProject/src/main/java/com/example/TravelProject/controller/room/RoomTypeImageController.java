package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.RoomTypeImage;
import com.example.TravelProject.service.Room.RoomTypeImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/room-type-images") // 엔드포인트: /api/room-type-images
@RequiredArgsConstructor
public class RoomTypeImageController {

    private final RoomTypeImageService roomImageService;

    // 특정 RoomType ID로 이미지 목록 조회
    @GetMapping("/room-type/{roomTypeId}")
    public List<RoomTypeImage> findByRoomTypeId(@PathVariable Integer roomTypeId) {
        return roomImageService.deleteAllByRoomTypeId(roomTypeId);
    }

    // 단일 이미지 ID로 조회
    @GetMapping("/{imageId}")
    public Optional<RoomTypeImage> findById(@PathVariable Integer imageId) {
        return roomImageService.findById(imageId);
    }

    // 이미지 등록
    @PostMapping
    public RoomTypeImage create(@RequestBody RoomTypeImage image) {
        return roomImageService.save(image);
    }

    // 이미지 삭제
    @DeleteMapping("/{imageId}")
    public void delete(@PathVariable Integer imageId) {
        roomImageService.deleteById(imageId);
    }
}
