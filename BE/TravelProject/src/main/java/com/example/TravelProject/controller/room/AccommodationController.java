package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.Accommodation;
import com.example.TravelProject.entity.room.AccommodationImage;
import com.example.TravelProject.service.Room.AccommodationImageService;
import com.example.TravelProject.service.Room.AccommodationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/accommodations")
@RequiredArgsConstructor
public class AccommodationController {

    private final AccommodationService accommodationService;
    private final AccommodationImageService accommodationImageService;

    @GetMapping("/filter-img")
    public List<AccommodationImage> getByAccommodationId(@RequestParam("accommodationId") Integer accommodationId) {
        return accommodationImageService.findImagesByAccommodationId(accommodationId);
    }
    @Operation(
        summary = "전체 숙소 목록 조회",
        description = """
            등록된 모든 숙소 정보를 조회합니다.
            관리자 또는 유저용 숙소 리스트 화면 등에 사용됩니다.
            """
    )
    @GetMapping
    public List<Accommodation> getAllAccommodations() {
        return accommodationService.findAll();
    }

    @Operation(
        summary = "숙소 ID로 조회",
        description = """
            숙소의 고유 ID를 기준으로 해당 숙소 정보를 조회합니다.
            존재하지 않을 경우 Optional.empty() 반환됩니다.
            """
    )
    @GetMapping("/{id}")
    public Optional<Accommodation> getAccommodationById(@PathVariable("id") Integer id) {
        return accommodationService.findById(id);
    }

    @Operation(
        summary = "숙소 등록 또는 수정",
        description = """
            전달받은 숙소 정보를 기반으로 숙소를 등록하거나 수정합니다.
            - ID가 존재하면 수정, 없으면 새로 등록됩니다.
            - 요청 본문에 JSON 형식의 숙소 정보를 포함해야 합니다.
            """
    )
    @PostMapping
    public Accommodation saveAccommodation(@RequestBody Accommodation accommodation) {
        return accommodationService.save(accommodation);
    }

    @Operation(
        summary = "숙소 삭제",
        description = """
            숙소 ID를 기준으로 해당 숙소를 삭제합니다.
            삭제 후에는 복구할 수 없습니다.
            """
    )
    @DeleteMapping("/{id}")
    public void deleteAccommodation(@PathVariable("id") Integer id) {
        accommodationService.deleteById(id);
    }

    @Operation(
        summary = "사용자 ID로 숙소 목록 조회",
        description = """
            해당 사용자가 등록한 모든 숙소 목록을 조회합니다.
            userId는 숙소의 소유자 ID입니다.
            """
    )
    @GetMapping("/user/{userId}")
    public List<Accommodation> getAccommodationsByOwner(@PathVariable("userId") Integer userId) {
        return accommodationService.findByOwnerUserId(userId);
    }

    @Operation(
        summary = "숙소 이름 검색",
        description = """
            숙소 이름에 해당 키워드가 포함된 숙소들을 검색합니다.
            부분 일치 검색으로 동작합니다.
            예: keyword=호텔 → "서울호텔", "호텔파크" 포함 결과 반환
            """
    )
    @GetMapping("/search")
    public List<Accommodation> searchByName(@RequestParam("search") String keyword) {
        return accommodationService.searchByName(keyword);
    }

    @Operation(
        summary = "국내/해외 숙소 필터링 조회",
        description = """
            isDomestic 값('Y' 또는 'N')을 기준으로 숙소를 필터링하여 조회합니다.
            - 'Y' : 국내 숙소
            - 'N' : 해외 숙소
            """
    )
    @GetMapping("/filter")
    public List<Accommodation> getAccommodationsByDomestic(@RequestParam("isDomestic") String isDomestic) {
        return accommodationService.findByIsDomestic(isDomestic.toUpperCase());
    }
}
