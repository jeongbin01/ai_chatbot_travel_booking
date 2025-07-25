package com.example.TravelProject.controller.Travelproduct;

import com.example.TravelProject.dto.Travelproduct.ItineraryDto;
import com.example.TravelProject.entity.Travelproduct.Itinerary;
import com.example.TravelProject.service.TravelProduct.ItineraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itineraries")
@RequiredArgsConstructor
public class ItineraryController {

    private final ItineraryService itineraryService;

    /**
     * 일정 생성
     * POST /api/itineraries
     */
    @PostMapping
    public ResponseEntity<Itinerary> createItinerary(@RequestBody ItineraryDto dto) {
        Itinerary created = itineraryService.createItinerary(dto);
        return ResponseEntity.ok(created);
    }

    /**
     * 전체 일정 조회
     * GET /api/itineraries
     */
    @GetMapping
    public ResponseEntity<List<Itinerary>> getAllItineraries() {
        List<Itinerary> list = itineraryService.getAllItineraries();
        return ResponseEntity.ok(list);
    }

    /**
     * 단일 일정 조회
     * GET /api/itineraries/{itineraryId}
     */
    @GetMapping("/{itineraryId}")
    public ResponseEntity<Itinerary> getItineraryById(@PathVariable Integer itineraryId) {
        Itinerary iti = itineraryService.getItineraryById(itineraryId);
        return ResponseEntity.ok(iti);
    }

    /**
     * 상품별 일정 조회
     * GET /api/itineraries/product/{productId}
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Itinerary>> getByProduct(@PathVariable Integer productId) {
        List<Itinerary> list = itineraryService.getItinerariesByProductId(productId);
        return ResponseEntity.ok(list);
    }

    /**
     * 일정 수정
     * PUT /api/itineraries/{itineraryId}
     */
    @PutMapping("/{itineraryId}")
    public ResponseEntity<Itinerary> updateItinerary(
            @PathVariable Integer itineraryId,
            @RequestBody ItineraryDto dto
    ) {
        Itinerary updated = itineraryService.updateItinerary(itineraryId, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * 일정 삭제
     * DELETE /api/itineraries/{itineraryId}
     */
    @DeleteMapping("/{itineraryId}")
    public ResponseEntity<Void> deleteItinerary(@PathVariable Integer itineraryId) {
        itineraryService.deleteItinerary(itineraryId);
        return ResponseEntity.noContent().build();
    }
}
