//package com.example.TravelProject.controller.room;
//
//import com.example.TravelProject.entity.room.AccommodationAmenity;
//import com.example.TravelProject.repository.Room.AccommodationAmenityRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/accommodation-amenities")
//@RequiredArgsConstructor
//public class AccommodationAmenityController {
//
//    private final AccommodationAmenityRepository accommodationAmenityService;
//
//    // 숙소에 연결된 편의시설 전체 조회
//    @GetMapping("/{accommodationId}")
//    public List<AccommodationAmenity> getAmenitiesByAccommodation(@PathVariable Integer accommodationId) {
//        return accommodationAmenityService.findByAccommodation_AccommodationId(accommodationId);
//    }
//
//    // 숙소에 편의시설 등록
//    @PostMapping
//    public AccommodationAmenity addAmenity(@RequestBody AccommodationAmenity amenity) {
//        return accommodationAmenityService.save(amenity);
//    }
//
//    // 숙소에 연결된 특정 편의시설 삭제
//    @DeleteMapping
//    public void deleteAmenity(
//            @RequestParam Integer accommodationId,
//            @RequestParam Integer amenityId
//    ) {
//        accommodationAmenityService.deleteByAccommodation_AccommodationIdAndAmenity_AmenityId(accommodationId, amenityId);
//    }
//
//    // 특정 숙소에 이미 해당 편의시설이 등록되어 있는지 확인
//    @GetMapping("/exists")
//    public boolean existsAmenity(
//            @RequestParam Integer accommodationId,
//            @RequestParam Integer amenityId
//    ) {
//        return accommodationAmenityService.existsByAccommodation_AccommodationIdAndAmenity_AmenityId(accommodationId, amenityId);
//    }
//}
