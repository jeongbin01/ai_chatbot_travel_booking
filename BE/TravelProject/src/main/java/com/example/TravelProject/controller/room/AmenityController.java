package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.Amenity;
import com.example.TravelProject.service.Room.AmenityService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/amenities")
@RequiredArgsConstructor
public class AmenityController {

    private final AmenityService amenityService;

    // 모든 편의시설 조회
    @Operation(
        summary = "편의시설 전체 조회",
        description = "등록된 모든 편의시설 목록을 반환합니다."
    )
    @GetMapping
    public List<Amenity> getAllAmenities() {
        return amenityService.findAll();
    }

    // 편의시설 ID로 단건 조회
    @Operation(
            summary = "편의시설 단건 조회",
            description = "amenityId로 특정 편의시설을 조회합니다."
        )
    @GetMapping("/{id}")
    public Optional<Amenity> getAmenityById(@PathVariable Integer id) {
        return amenityService.findById(id);
    }
}