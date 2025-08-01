package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.RoomType;
import com.example.TravelProject.service.Room.RoomTypeService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/room-types")
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @Operation(
            summary = "전체 객실 타입(RoomType) 목록 조회",
            description = """
                시스템에 등록된 모든 객실 타입(RoomType) 정보를 조회합니다.
                객실 등록 또는 관리 시 선택용으로 사용됩니다.
                """
        )
    @GetMapping
    public List<RoomType> findAll() {
        return roomTypeService.findAll();
    }

    @Operation(
        summary = "객실 타입 단건 조회",
        description = """
            roomTypeId를 기준으로 특정 객실 타입 정보를 조회합니다.
            존재하지 않는 경우 404(Not Found) 응답이 반환될 수 있습니다.
            """
    )
    @GetMapping("/{roomTypeId}")
    public Optional<RoomType> findById(@PathVariable("roomTypeId") Integer roomTypeId) {
        return roomTypeService.findById(roomTypeId);
    }

    @Operation(
        summary = "객실 타입 등록",
        description = """
            새로운 객실 타입 정보를 등록합니다.
            예: '스탠다드룸', '디럭스룸', '패밀리룸' 등
            """
    )
    @PostMapping
    public RoomType create(@RequestBody RoomType roomType) {
        return roomTypeService.save(roomType);
    }

    @Operation(
        summary = "객실 타입 수정",
        description = """
            roomTypeId를 기준으로 기존 객실 타입 정보를 수정합니다.
            수정할 내용은 요청 본문(RoomType)으로 전달합니다.
            """
    )
    @PutMapping("/{roomTypeId}")
    public RoomType update(@PathVariable("roomTypeId") Integer roomTypeId, @RequestBody RoomType updatedRoomType) {
        return roomTypeService.update(roomTypeId, updatedRoomType);
    }

    @Operation(
        summary = "객실 타입 삭제",
        description = """
            roomTypeId를 기준으로 객실 타입 정보를 삭제합니다.
            삭제 시 해당 타입이 연결된 객실이 있다면 주의가 필요합니다.
            """
    )
    @DeleteMapping("/{roomTypeId}")
    public void delete(@PathVariable("roomTypeId") Integer roomTypeId) {
        roomTypeService.deleteById(roomTypeId);
    }
}