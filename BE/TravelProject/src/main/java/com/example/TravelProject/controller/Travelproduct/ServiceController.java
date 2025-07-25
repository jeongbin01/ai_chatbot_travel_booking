package com.example.TravelProject.controller.Travelproduct;

import com.example.TravelProject.dto.Travelproduct.ServiceResponseDTO;
import com.example.TravelProject.service.TravelProduct.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    /**
     * 새 서비스 생성
     * POST /api/services
     */
    @PostMapping
    public ResponseEntity<ServiceResponseDTO> createService(
            @RequestBody ServiceResponseDTO dto
    ) {
        ServiceResponseDTO created = serviceService.createService(dto);
        return ResponseEntity.ok(created);
    }

    /**
     * 전체 서비스 조회
     * GET /api/services
     */
    @GetMapping
    public ResponseEntity<List<ServiceResponseDTO>> getAllServices() {
        List<ServiceResponseDTO> list = serviceService.getAllServices();
        return ResponseEntity.ok(list);
    }

    /**
     * 단일 서비스 조회
     * GET /api/services/{serviceId}
     */
    @GetMapping("/{serviceId}")
    public ResponseEntity<ServiceResponseDTO> getServiceById(
            @PathVariable Integer serviceId
    ) {
        ServiceResponseDTO dto = serviceService.getServiceById(serviceId);
        return ResponseEntity.ok(dto);
    }

    /**
     * 서비스 업데이트
     * PUT /api/services/{serviceId}
     */
    @PutMapping("/{serviceId}")
    public ResponseEntity<ServiceResponseDTO> updateService(
            @PathVariable Integer serviceId,
            @RequestBody ServiceResponseDTO dto
    ) {
        ServiceResponseDTO updated = serviceService.updateService(serviceId, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * 서비스 삭제
     * DELETE /api/services/{serviceId}
     */
    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> deleteService(
            @PathVariable Integer serviceId
    ) {
        serviceService.deleteService(serviceId);
        return ResponseEntity.noContent().build();
    }
}
