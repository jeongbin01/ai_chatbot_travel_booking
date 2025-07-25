package com.example.TravelProject.controller.Travelproduct;

import com.example.TravelProject.dto.Travelproduct.IncludedServiceDto;
import com.example.TravelProject.entity.Travelproduct.IncludedService;
import com.example.TravelProject.service.TravelProduct.IncludedServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/included-services")
@RequiredArgsConstructor
public class IncludedServiceController {

    private final IncludedServiceService includedServiceService;

    /**
     * 포함 서비스 생성
     * POST /api/included-services
     */
    @PostMapping
    public ResponseEntity<IncludedService> createIncludedService(
            @RequestBody IncludedServiceDto dto
    ) {
        IncludedService created = includedServiceService.createIncludedService(dto);
        return ResponseEntity.ok(created);
    }

    /**
     * 전체 포함 서비스 목록 조회
     * GET /api/included-services
     */
    @GetMapping
    public ResponseEntity<List<IncludedService>> getAllIncludedServices() {
        List<IncludedService> list = includedServiceService.getAllIncludedServices();
        return ResponseEntity.ok(list);
    }

    /**
     * 특정 상품에 포함된 서비스 목록 조회
     * GET /api/included-services/product/{productId}
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<IncludedService>> getByProduct(
            @PathVariable Integer productId
    ) {
        List<IncludedService> list = includedServiceService.getIncludedServicesByProductId(productId);
        return ResponseEntity.ok(list);
    }

    /**
     * 포함 서비스 삭제
     * DELETE /api/included-services/{productId}/{serviceId}
     */
    @DeleteMapping("/{productId}/{serviceId}")
    public ResponseEntity<Void> deleteIncludedService(
            @PathVariable Integer productId,
            @PathVariable Integer serviceId
    ) {
        includedServiceService.deleteIncludedService(productId, serviceId);
        return ResponseEntity.noContent().build();
    }
}
