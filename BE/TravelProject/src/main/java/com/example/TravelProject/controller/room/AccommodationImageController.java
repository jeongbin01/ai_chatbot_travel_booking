package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.AccommodationImage;
import com.example.TravelProject.service.Room.AccommodationImageService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/accommodation-images")
@RequiredArgsConstructor
public class AccommodationImageController {

    private final AccommodationImageService accommodationImageService;

    @Operation(
            summary = "모든 숙소 이미지 조회",
            description = """
                모든 숙소의 이미지 데이터를 반환합니다.
                테스트용 또는 전체 이미지 목록이 필요한 경우 사용됩니다.
                """
        )
    @GetMapping
    public List<AccommodationImage> getAllImages() {
        return accommodationImageService.findAllImages();
    }
    
    @Operation(
            summary = "숙소 ID로 이미지 목록 조회",
            description = """
                특정 숙소(accommodationId)에 등록된 이미지 리스트를 조회합니다.
                orderNum(정렬 순서)에 따라 오름차순으로 정렬되어 반환됩니다.
                """
        )
    @GetMapping("/{accommodationId}")
    public List<AccommodationImage> getImagesByAccommodation(@PathVariable Integer accommodationId) {
        return accommodationImageService.findImagesByAccommodationId(accommodationId);
    }

    @Operation(
            summary = "숙소 썸네일 이미지 조회",
            description = """
                특정 숙소(accommodationId)에 대해 대표 이미지(orderNum == 0)를 조회합니다.
                """
        )
    @GetMapping("/{accommodationId}/thumbnail")
    public AccommodationImage getThumbnail(@PathVariable Integer accommodationId) {
        return accommodationImageService.findThumbnail(accommodationId);
    }


    @Operation(
            summary = "숙소 이미지 등록",
            description = """
                숙소에 대한 새로운 이미지를 등록합니다.
                AccommodationImage 객체에는 숙소 ID, 이미지 URL, 순서(orderNum) 정보가 포함되어야 합니다.
                """
        )
    @PostMapping
    public AccommodationImage uploadImage(@RequestBody AccommodationImage image) {
        return accommodationImageService.saveImage(image);
    }

    @Operation(
            summary = "이미지 ID로 삭제",
            description = """
                이미지 ID를 기준으로 해당 이미지를 삭제합니다.
                """
        )
    @DeleteMapping("/{imageId}")
    public void deleteImage(@PathVariable Integer imageId) {
        accommodationImageService.deleteById(imageId);
    }

    @Operation(
            summary = "숙소 ID로 모든 이미지 일괄 삭제",
            description = """
                해당 숙소에 등록된 모든 이미지를 일괄 삭제합니다.
                보통 숙소 삭제 또는 이미지 초기화 시 사용됩니다.
                """
        )
    @DeleteMapping("/all/{accommodationId}")
    public void deleteAllImagesByAccommodation(@PathVariable Integer accommodationId) {
        accommodationImageService.deleteAllByAccommodationId(accommodationId);
    }

    @Operation(
            summary = "이미지 ID로 단건 조회",
            description = """
                개별 이미지 ID(imageId)를 기준으로 단건 이미지 정보를 조회합니다.
                """
        )
    @GetMapping("/image/{imageId}")
    public Optional<AccommodationImage> findById(@PathVariable Integer imageId) {
        return accommodationImageService.findById1(imageId);
    }
}
