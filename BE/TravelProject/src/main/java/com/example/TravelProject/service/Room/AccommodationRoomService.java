package com.example.TravelProject.service.Room;

import com.example.TravelProject.repository.Room.AccommodationRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccommodationRoomService {

    private final AccommodationRoomRepository accommodationRoomRepository;

    // 전체 조회
    public List<Object[]> getAllAccommodationRooms() {
        return accommodationRoomRepository.findAccommodationRoomData();
    }

    // 특정 숙소 ID 조회
    public List<Object[]> getAccommodationRoomsById(Integer accommodationId) {
        return accommodationRoomRepository.findByAccommodationId(accommodationId);
    }
    public List<Object[]> getAccommodationRoomsByDomestic(String isDomestic) {
        return accommodationRoomRepository.findByDomesticFlag(isDomestic);
    }
    public Object[] getAccommodationRoomDetail(Integer accommodationId, Integer roomTypeId) {
        return accommodationRoomRepository.findAccommodationRoomDetail(accommodationId, roomTypeId);
    }
}
