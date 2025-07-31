package com.example.TravelProject.controller.Travelproduct;

import com.example.TravelProject.dto.Travelproduct.IncludedServiceDto;
import com.example.TravelProject.entity.Travelproduct.IncludedService;
import com.example.TravelProject.service.TravelProduct.IncludedServiceService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/included-services")
@RequiredArgsConstructor
public class IncludedServiceController {

    private final IncludedServiceService includedServiceService;

    @Operation(
            summary = "포함 서비스 생성",
            description = """
                여행 상품에 포함된 서비스를 새로 등록합니다.
                예: '왕복 항공권', '조식 포함', '현지 가이드' 등.
                
                요청 본문에는 productId 및 serviceId가 포함되어야 합니다.
                """
        )
    @PostMapping
    public ResponseEntity<IncludedService> createIncludedService(
            @RequestBody IncludedServiceDto dto
    ) {
        IncludedService created = includedServiceService.createIncludedService(dto);
        return ResponseEntity.ok(created);
    }

    @Operation(
        summary = "전체 포함 서비스 목록 조회",
        description = """
            등록된 모든 IncludedService 목록을 조회합니다.
            관리용 백오피스 화면 또는 테스트용 엔드포인트에 사용됩니다.
            """
    )
    @GetMapping
    public ResponseEntity<List<IncludedService>> getAllIncludedServices() {
        List<IncludedService> list = includedServiceService.getAllIncludedServices();
        return ResponseEntity.ok(list);
    }

    @Operation(
        summary = "상품별 포함 서비스 목록 조회",
        description = """
            특정 여행 상품(productId)에 연결된 포함 서비스들을 조회합니다.
            상품 상세 페이지나 포함 서비스 요약에 활용됩니다.
            """
    )
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<IncludedService>> getByProduct(@PathVariable("productId") Integer productId) {
        List<IncludedService> list = includedServiceService.getIncludedServicesByProductId(productId);
        return ResponseEntity.ok(list);
    }

    @Operation(
        summary = "포함 서비스 삭제",
        description = """
            특정 상품에 연결된 포함 서비스 항목을 삭제합니다.
            복합 키 구조: (productId, serviceId)로 구성됩니다.
            """
    )
    @DeleteMapping("/{productId}/{serviceId}")
    public ResponseEntity<Void> deleteIncludedService(
            @PathVariable("productId") Integer productId,
            @PathVariable("serviceId") Integer serviceId) {
        includedServiceService.deleteIncludedService(productId, serviceId);
        return ResponseEntity.noContent().build();
    }
}