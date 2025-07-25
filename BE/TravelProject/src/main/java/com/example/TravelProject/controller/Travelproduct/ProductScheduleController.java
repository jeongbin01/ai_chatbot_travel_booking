package com.example.TravelProject.controller.Travelproduct;

import com.example.TravelProject.dto.Travelproduct.ProductScheduleDto;
import com.example.TravelProject.entity.Travelproduct.ProductSchedule;
import com.example.TravelProject.service.TravelProduct.ProductScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-schedules")
@RequiredArgsConstructor
public class ProductScheduleController {

    private final ProductScheduleService scheduleService;

    /**
     * 새 스케줄 생성
     * POST /api/product-schedules
     */
    @PostMapping
    public ResponseEntity<ProductSchedule> createSchedule(@RequestBody ProductScheduleDto dto) {
        ProductSchedule created = scheduleService.createProductSchedule(dto);
        return ResponseEntity.ok(created);
    }

    /**
     * 전체 스케줄 조회
     * GET /api/product-schedules
     */
    @GetMapping
    public ResponseEntity<List<ProductSchedule>> getAllSchedules() {
        List<ProductSchedule> list = scheduleService.getAllProductSchedules();
        return ResponseEntity.ok(list);
    }

    /**
     * ID로 단일 스케줄 조회
     * GET /api/product-schedules/{scheduleId}
     */
    @GetMapping("/{scheduleId}")
    public ResponseEntity<ProductSchedule> getScheduleById(@PathVariable Integer scheduleId) {
        ProductSchedule schedule = scheduleService.getProductScheduleById(scheduleId);
        return ResponseEntity.ok(schedule);
    }

    /**
     * 상품별 스케줄 조회 (출발일 오름차순)
     * GET /api/product-schedules/product/{productId}
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductSchedule>> getByProduct(@PathVariable Integer productId) {
        List<ProductSchedule> list = scheduleService.getSchedulesByProductId(productId);
        return ResponseEntity.ok(list);
    }

    /**
     * 오늘 이후 출발하는 스케줄 조회
     * GET /api/product-schedules/upcoming
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<ProductSchedule>> getUpcomingSchedules() {
        List<ProductSchedule> list = scheduleService.getUpcomingSchedules();
        return ResponseEntity.ok(list);
    }

    /**
     * 스케줄 업데이트
     * PUT /api/product-schedules/{scheduleId}
     */
    @PutMapping("/{scheduleId}")
    public ResponseEntity<ProductSchedule> updateSchedule(
            @PathVariable Integer scheduleId,
            @RequestBody ProductScheduleDto dto
    ) {
        ProductSchedule updated = scheduleService.updateProductSchedule(scheduleId, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * 스케줄 삭제
     * DELETE /api/product-schedules/{scheduleId}
     */
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Integer scheduleId) {
        scheduleService.deleteProductSchedule(scheduleId);
        return ResponseEntity.noContent().build();
    }
}
