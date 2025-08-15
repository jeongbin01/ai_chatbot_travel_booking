package com.example.TravelProject.controller.room;

import com.example.TravelProject.service.Room.AccommodationRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/app/accommodations-rooms")
public class AccommodationRoomController {

    private final AccommodationRoomService accommodationRoomService;

    // 전체 조회
    @GetMapping
    public List<Object[]> getAllAccommodationRooms() {
        return accommodationRoomService.getAllAccommodationRooms();
    }

    // 특정 숙소 ID로 조회
    @GetMapping("/{accommodationId}")
    public List<Object[]> getAccommodationRoomsById(@PathVariable("accommodationId") Integer accommodationId) {
        return accommodationRoomService.getAccommodationRoomsById(accommodationId);
    }
    @GetMapping(params = "isDomestic")
    public List<Object[]> getAccommodationRoomsByDomestic(@RequestParam("isDomestic") String isDomestic) {
        return accommodationRoomService.getAccommodationRoomsByDomestic(isDomestic);
    }
    @GetMapping("/acc{accommodationId}/roomtype{roomTypeId}")
    public Object[] getAccommodationRoomDetail(
            @PathVariable("accommodationId") Integer accommodationId,
            @PathVariable("roomTypeId") Integer roomTypeId
    ){
        return accommodationRoomService.getAccommodationRoomDetail(accommodationId, roomTypeId);
    }
}