//package com.example.TravelProject.controller.room;
//
//import com.example.TravelProject.entity.room.Amenity;
//import com.example.TravelProject.service.Room.AmenityService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/amenities")
//@RequiredArgsConstructor
//public class AmenityController {
//
//    private final AmenityService amenityService;
//
//    // 모든 편의시설 조회
//    @GetMapping
//    public List<Amenity> getAllAmenities() {
//        return amenityService.findAll();
//    }
//
//    // 편의시설 ID로 단건 조회
//    @GetMapping("/{id}")
//    public Optional<Amenity> getAmenityById(@PathVariable Integer id) {
//        return amenityService.findById(id);
//    }
//
//    // 새로운 편의시설 등록
//    @PostMapping
//    public Amenity createAmenity(@RequestBody Amenity amenity) {
//        return amenityService.save(amenity);
//    }
//
//    // 편의시설 삭제
//    @DeleteMapping("/{id}")
//    public void deleteAmenity(@PathVariable Integer id) {
//        amenityService.deleteById(id);
//    }
//}
