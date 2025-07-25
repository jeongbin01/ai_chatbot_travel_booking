package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.AccommodationImage;
import com.example.TravelProject.service.Room.AccommodationImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/accommodation-images")
@RequiredArgsConstructor
public class AccommodationImageController {

    private final AccommodationImageService accommodationImageService;

    // 숙소 ID로 모든 이미지 조회 (orderNum 기준 정렬)
    @GetMapping("/{accommodationId}")
    public List<AccommodationImage> getImagesByAccommodation(@PathVariable Integer accommodationId) {
        return accommodationImageService.findImagesByAccommodationId(accommodationId);
    }

    // 대표 이미지 조회 (orderNum == 0)
    @GetMapping("/{accommodationId}/thumbnail")
    public AccommodationImage getThumbnail(@PathVariable Integer accommodationId) {
        return accommodationImageService.findThumbnail(accommodationId);
    }

    // 숙소 이미지 등록
    @PostMapping
    public AccommodationImage uploadImage(@RequestBody AccommodationImage image) {
        return accommodationImageService.saveImage(image);
    }

    // 이미지 ID로 단건 삭제
    @DeleteMapping("/{imageId}")
    public void deleteImage(@PathVariable Integer imageId) {
        accommodationImageService.deleteById(imageId);
    }

    // 숙소 ID로 모든 이미지 일괄 삭제
    @DeleteMapping("/all/{accommodationId}")
    public void deleteAllImagesByAccommodation(@PathVariable Integer accommodationId) {
        accommodationImageService.deleteAllByAccommodationId(accommodationId);
    }

    // 이미지 ID로 단건 조회
    @GetMapping("/image/{imageId}")
    public Optional<AccommodationImage> findById(@PathVariable Integer imageId) {
        return accommodationImageService.findById1(imageId);
    }
}
