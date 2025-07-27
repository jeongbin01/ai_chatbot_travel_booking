package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.Room;
import com.example.TravelProject.service.Room.RoomService;
import com.example.TravelProject.service.Room.RoomTypeService;
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

    @GetMapping
    public List<Room> findAllRooms() {
        return roomService.findAll();
    }

    @GetMapping("/{roomId}")
    public Optional<Room> findRoomById(@PathVariable Integer roomId) {
        return roomService.findById(roomId);
    }

}
