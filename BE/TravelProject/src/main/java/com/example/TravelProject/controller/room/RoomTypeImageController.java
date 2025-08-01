package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.RoomTypeImage;
import com.example.TravelProject.service.Room.RoomTypeImageService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/room-type-images") // 엔드포인트: /api/room-type-images
@RequiredArgsConstructor
public class RoomTypeImageController {

    private final RoomTypeImageService roomImageService;

    @Operation(
            summary = "RoomType ID로 이미지 목록 조회",
            description = """
                특정 RoomType에 속한 모든 이미지를 조회합니다.
                보통 객실 타입별 상세 이미지 렌더링 시 사용됩니다.
                """
        )
    @GetMapping("/room-type/{roomTypeId}")
    public List<RoomTypeImage> findByRoomTypeId(@PathVariable("roomTypeId") Integer roomTypeId) {
        return roomImageService.deleteAllByRoomTypeId(roomTypeId);
    }

    @Operation(
        summary = "이미지 ID로 단건 조회",
        description = """
            고유 이미지 ID(imageId)를 통해 단일 RoomTypeImage 정보를 조회합니다.
            존재하지 않을 경우 Optional.empty()가 반환됩니다.
            """
    )
    @GetMapping("/{imageId}")
    public Optional<RoomTypeImage> findById(@PathVariable("imageId") Integer imageId) {
        return roomImageService.findById(imageId);
    }

    @Operation(
        summary = "RoomType 이미지 등록",
        description = """
            새로운 RoomType 이미지 정보를 등록합니다.
            요청 본문에는 이미지 URL, roomTypeId, 정렬 순서(orderNum) 등을 포함해야 합니다.
            """
    )
    @PostMapping
    public RoomTypeImage create(@RequestBody RoomTypeImage image) {
        return roomImageService.save(image);
    }

    @Operation(
        summary = "RoomType 이미지 삭제",
        description = """
            이미지 ID를 기준으로 RoomType에 등록된 이미지를 삭제합니다.
            삭제 성공 시 204 No Content 응답을 반환합니다.
            """
    )
    @DeleteMapping("/{imageId}")
    public void delete(@PathVariable("imageId") Integer imageId) {
        roomImageService.deleteById(imageId);
    }
}