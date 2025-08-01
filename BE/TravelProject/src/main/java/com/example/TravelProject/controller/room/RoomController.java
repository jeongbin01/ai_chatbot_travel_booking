package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.Room;
import com.example.TravelProject.service.Room.RoomService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/rooms")  // URL Prefix 설정
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @Operation(
            summary = "전체 객실 조회",
            description = """
                등록된 모든 객실(Room) 정보를 조회합니다.
                관리자 페이지 또는 객실 관리 화면에 사용됩니다.
                """
        )
    @GetMapping
    public List<Room> findAllRooms() {
        return roomService.findAll();
    }

    @Operation(
        summary = "객실 단건 조회",
        description = """
            roomId를 기준으로 특정 객실 정보를 조회합니다.
            존재하지 않을 경우 404(Not Found) 응답이 반환됩니다.
            """
    )
    @GetMapping("/{roomId}")
    public Optional<Room> findRoomById(@PathVariable("roomId") Integer roomId) {
        return roomService.findById(roomId);
    }

    @Operation(
        summary = "객실 등록",
        description = """
            새 객실을 등록합니다.
            요청 본문에는 객실명, 타입, 수용 인원 등의 정보가 포함되어야 합니다.
            """
    )
    @PostMapping
    public Room createRoom(@RequestBody Room room) {
        return roomService.save(room);
    }

    @Operation(
        summary = "객실 정보 수정",
        description = """
            roomId를 기준으로 기존 객실 정보를 수정합니다.
            요청 본문에는 수정할 필드가 포함되어야 합니다.
            """
    )
    @PutMapping("/{roomId}")
    public Room updateRoom(@PathVariable("roomId") Integer roomId, @RequestBody Room updatedRoom) {
        return roomService.update(roomId, updatedRoom);
    }

    @Operation(
        summary = "객실 삭제",
        description = """
            roomId를 기준으로 객실을 삭제합니다.
            성공 시 204 No Content 응답을 반환합니다.
            """
    )
    @DeleteMapping("/{roomId}")
    public void deleteRoom(@PathVariable("roomId") Integer roomId) {
        roomService.deleteById(roomId);
    }
}