package com.example.TravelProject.controller.Travelproduct;

import com.example.TravelProject.dto.Travelproduct.ServiceResponseDTO;
import com.example.TravelProject.service.TravelProduct.ServiceService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @Operation(
            summary = "새로운 서비스 항목 생성",
            description = """
                여행 상품에 포함될 수 있는 서비스 항목을 생성합니다.
                예: 가이드 포함, 식사 제공, 입장권 포함 등.
                """
        )
    @PostMapping
    public ResponseEntity<ServiceResponseDTO> createService(
            @RequestBody ServiceResponseDTO dto
    ) {
        ServiceResponseDTO created = serviceService.createService(dto);
        return ResponseEntity.ok(created);
    }

    @Operation(
        summary = "모든 서비스 항목 조회",
        description = """
            현재 등록된 모든 서비스 항목을 조회합니다.
            클라이언트 또는 관리자 페이지에서 선택 항목 리스트를 제공할 때 사용됩니다.
            """
    )
    @GetMapping
    public ResponseEntity<List<ServiceResponseDTO>> getAllServices() {
        List<ServiceResponseDTO> list = serviceService.getAllServices();
        return ResponseEntity.ok(list);
    }

    @Operation(
        summary = "단일 서비스 항목 조회",
        description = """
            서비스 ID (serviceId)를 통해 해당 서비스를 단건 조회합니다.
            서비스 상세보기 또는 수정 시 사용됩니다.
            """
    )
    @GetMapping("/{serviceId}")
    public ResponseEntity<ServiceResponseDTO> getServiceById(
            @PathVariable Integer serviceId
    ) {
        ServiceResponseDTO dto = serviceService.getServiceById(serviceId);
        return ResponseEntity.ok(dto);
    }

    @Operation(
        summary = "서비스 항목 수정",
        description = """
            특정 서비스 ID를 기준으로 서비스 항목 정보를 수정합니다.
            이름, 설명, 제공 여부 등의 필드를 변경할 수 있습니다.
            """
    )
    @PutMapping("/{serviceId}")
    public ResponseEntity<ServiceResponseDTO> updateService(
            @PathVariable Integer serviceId,
            @RequestBody ServiceResponseDTO dto
    ) {
        ServiceResponseDTO updated = serviceService.updateService(serviceId, dto);
        return ResponseEntity.ok(updated);
    }

    @Operation(
        summary = "서비스 항목 삭제",
        description = """
            서비스 ID(serviceId)를 기준으로 해당 서비스 항목을 삭제합니다.
            연관된 여행 상품이 있는 경우 주의가 필요합니다.
            """
    )
    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> deleteService(
            @PathVariable Integer serviceId
    ) {
        serviceService.deleteService(serviceId);
        return ResponseEntity.noContent().build();
    }
}