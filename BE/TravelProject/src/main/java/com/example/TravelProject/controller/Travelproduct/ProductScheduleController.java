package com.example.TravelProject.controller.Travelproduct;

import com.example.TravelProject.dto.Travelproduct.ProductScheduleDto;
import com.example.TravelProject.entity.Travelproduct.ProductSchedule;
import com.example.TravelProject.service.TravelProduct.ProductScheduleService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/product-schedules")
@RequiredArgsConstructor
public class ProductScheduleController {

    private final ProductScheduleService scheduleService;

    @Operation(
            summary = "새 스케줄 등록",
            description = """
                새로운 여행 상품 스케줄을 등록합니다.
                필수 필드는 productId, 출발일, 종료일, 가격 등입니다.
                """
        )
    @PostMapping
    public ResponseEntity<ProductSchedule> createSchedule(@RequestBody ProductScheduleDto dto) {
        ProductSchedule created = scheduleService.createProductSchedule(dto);
        return ResponseEntity.ok(created);
    }

    @Operation(
        summary = "전체 스케줄 목록 조회",
        description = """
            등록된 모든 상품 스케줄 정보를 반환합니다.
            관리자가 전체 리스트를 조회할 때 사용됩니다.
            """
    )
    @GetMapping
    public ResponseEntity<List<ProductSchedule>> getAllSchedules() {
        List<ProductSchedule> list = scheduleService.getAllProductSchedules();
        return ResponseEntity.ok(list);
    }

    @Operation(
        summary = "단일 스케줄 조회",
        description = """
            특정 스케줄 ID(scheduleId)를 기준으로 단일 스케줄 정보를 조회합니다.
            """
    )
    @GetMapping("/{scheduleId}")
    public ResponseEntity<ProductSchedule> getScheduleById(@PathVariable("scheduleId}") Integer scheduleId) {
        ProductSchedule schedule = scheduleService.getProductScheduleById(scheduleId);
        return ResponseEntity.ok(schedule);
    }

    @Operation(
        summary = "상품별 스케줄 조회",
        description = """
            특정 상품 ID(productId)에 해당하는 모든 스케줄을 조회합니다.
            출발일 기준 오름차순으로 정렬됩니다.
            """
    )
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductSchedule>> getByProduct(@PathVariable("productId") Integer productId) {
        List<ProductSchedule> list = scheduleService.getSchedulesByProductId(productId);
        return ResponseEntity.ok(list);
    }

    @Operation(
        summary = "다가오는 스케줄 조회",
        description = """
            오늘 이후로 출발 예정인 모든 상품 스케줄을 조회합니다.
            출발일 기준 오름차순으로 정렬됩니다.
            """
    )
    @GetMapping("/upcoming")
    public ResponseEntity<List<ProductSchedule>> getUpcomingSchedules() {
        List<ProductSchedule> list = scheduleService.getUpcomingSchedules();
        return ResponseEntity.ok(list);
    }

    @Operation(
        summary = "스케줄 정보 수정",
        description = """
            스케줄 ID를 기준으로 기존 정보를 수정합니다.
            출발일, 종료일, 잔여좌석, 가격 등을 변경할 수 있습니다.
            """
    )
    @PutMapping("/{scheduleId}")
    public ResponseEntity<ProductSchedule> updateSchedule(
            @PathVariable Integer scheduleId,
            @RequestBody ProductScheduleDto dto
    ) {
        ProductSchedule updated = scheduleService.updateProductSchedule(scheduleId, dto);
        return ResponseEntity.ok(updated);
    }

    @Operation(
        summary = "스케줄 삭제",
        description = """
            스케줄 ID(scheduleId)를 기준으로 해당 상품 스케줄을 삭제합니다.
            삭제 성공 시 204 No Content 응답을 반환합니다.
            """
    )
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Integer scheduleId) {
        scheduleService.deleteProductSchedule(scheduleId);
        return ResponseEntity.noContent().build();
    }
}