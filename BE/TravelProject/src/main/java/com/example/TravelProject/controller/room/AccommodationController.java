package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.Accommodation;
import com.example.TravelProject.service.Room.AccommodationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accommodations")
@RequiredArgsConstructor
public class AccommodationController {

    private final AccommodationService accommodationService;

    // 전체 숙소 조회
    @GetMapping
    public List<Accommodation> getAllAccommodations() {
        return accommodationService.findAll();
    }

    // 숙소 ID로 조회
    @GetMapping("/{id}")
    public Optional<Accommodation> getAccommodationById(@PathVariable Integer id) {
        return accommodationService.findById(id);
    }

    // 숙소 등록 또는 수정
    @PostMapping
    public Accommodation saveAccommodation(@RequestBody Accommodation accommodation) {
        return accommodationService.save(accommodation);
    }

    // 숙소 삭제
    @DeleteMapping("/{id}")
    public void deleteAccommodation(@PathVariable Integer id) {
        accommodationService.deleteById(id);
    }

    // 특정 사용자(소유자)의 숙소 목록 조회
    @GetMapping("/user/{userId}")
    public List<Accommodation> getAccommodationsByOwner(@PathVariable Integer userId) {
        return accommodationService.findByOwnerUserId(userId);
    }

    // 숙소 이름으로 부분 검색
    @GetMapping("/search")
    public List<Accommodation> searchByName(@RequestParam String keyword) {
        return accommodationService.searchByName(keyword);
    }
}
