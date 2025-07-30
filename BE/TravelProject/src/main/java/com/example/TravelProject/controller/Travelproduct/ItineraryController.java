package com.example.TravelProject.controller.Travelproduct;

import com.example.TravelProject.dto.Travelproduct.ItineraryDto;
import com.example.TravelProject.entity.Travelproduct.Itinerary;
import com.example.TravelProject.service.TravelProduct.ItineraryService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/itineraries")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    @Operation(
            summary = "여행 일정 생성",
            description = """
                새로운 여행 일정(Itinerary)을 생성합니다.
                요청 본문에는 여행 상품 ID, 일차, 시간, 활동 내용 등의 정보가 포함되어야 합니다.
                """
        )
    @PostMapping
    public ResponseEntity<Itinerary> createItinerary(@RequestBody ItineraryDto dto) {
        Itinerary created = itineraryService.createItinerary(dto);
        return ResponseEntity.ok(created);
    }

    @Operation(
        summary = "전체 일정 조회",
        description = """
            등록된 모든 여행 일정을 조회합니다.
            관리자 페이지에서 일괄 확인하거나 디버깅용으로 사용됩니다.
            """
    )
    @GetMapping
    public ResponseEntity<List<Itinerary>> getAllItineraries() {
        List<Itinerary> list = itineraryService.getAllItineraries();
        return ResponseEntity.ok(list);
    }

    @Operation(
        summary = "단일 일정 조회",
        description = """
            일정 ID(itineraryId)를 기준으로 단건 여행 일정 정보를 조회합니다.
            존재하지 않을 경우 404 응답이 반환될 수 있습니다.
            """
    )
    @GetMapping("/{itineraryId}")
    public ResponseEntity<Itinerary> getItineraryById(@PathVariable Integer itineraryId) {
        Itinerary iti = itineraryService.getItineraryById(itineraryId);
        return ResponseEntity.ok(iti);
    }

    @Operation(
        summary = "상품별 일정 목록 조회",
        description = """
            특정 여행 상품(productId)에 연결된 모든 일정을 조회합니다.
            일차 순서대로 정렬되어 반환될 수 있습니다.
            """
    )
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Itinerary>> getByProduct(@PathVariable Integer productId) {
        List<Itinerary> list = itineraryService.getItinerariesByProductId(productId);
        return ResponseEntity.ok(list);
    }

    @Operation(
        summary = "일정 수정",
        description = """
            일정 ID(itineraryId)를 기준으로 기존 여행 일정 정보를 수정합니다.
            수정할 내용은 요청 본문(ItineraryDto)으로 전달해야 합니다.
            """
    )
    @PutMapping("/{itineraryId}")
    public ResponseEntity<Itinerary> updateItinerary(
            @PathVariable Integer itineraryId,
            @RequestBody ItineraryDto dto
    ) {
        Itinerary updated = itineraryService.updateItinerary(itineraryId, dto);
        return ResponseEntity.ok(updated);
    }

    @Operation(
        summary = "일정 삭제",
        description = """
            일정 ID(itineraryId)를 기준으로 해당 일정을 삭제합니다.
            삭제 성공 시 204 No Content 응답을 반환합니다.
            """
    )
    @DeleteMapping("/{itineraryId}")
    public ResponseEntity<Void> deleteItinerary(@PathVariable Integer itineraryId) {
        itineraryService.deleteItinerary(itineraryId);
        return ResponseEntity.noContent().build();
    }
}