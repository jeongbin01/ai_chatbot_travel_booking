package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.Room;
import com.example.TravelProject.service.Room.RoomService;
import com.example.TravelProject.service.Room.RoomTypeService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/roomClient")  // URL Prefix 설정
@RequiredArgsConstructor
public class RoomClientController {
    private final RoomService roomService;
    private final RoomTypeService roomTypeService;

    @Operation(
            summary = "모든 객실 조회",
            description = """
                등록된 전체 객실(Room) 목록을 조회합니다.
                숙소 상세 페이지 또는 예약 가능한 객실 목록 표시 등에 사용됩니다.
                """
        )
        @GetMapping
        public List<Room> findAllRooms() {
            return roomService.findAll();
        }

        @Operation(
            summary = "객실 ID로 단건 조회",
            description = """
                roomId를 기준으로 해당 객실 정보를 단건 조회합니다.
                존재하지 않는 경우 Optional.empty()를 반환합니다.
                """
        )
        @GetMapping("/{roomId}")
        public Optional<Room> findRoomById(@PathVariable("roomId") Integer roomId) {
            return roomService.findById(roomId);
        }
    }