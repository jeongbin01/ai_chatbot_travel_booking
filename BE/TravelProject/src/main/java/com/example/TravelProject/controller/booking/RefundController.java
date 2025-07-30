package com.example.TravelProject.controller.booking;

import com.example.TravelProject.entity.booking.Refund;
import com.example.TravelProject.service.Booking.RefundServuce;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/refund")
@RequiredArgsConstructor
public class RefundController {

    private final RefundServuce refundServuce;

    @Operation(summary = "환불 ID로 조회", description = "고유 환불 ID를 통해 환불 정보를 단건 조회합니다.")
    @GetMapping("/{refundId}")
    public Optional<Refund> getRefundById(@PathVariable Integer refundId) {
        return refundServuce.getRefundById(refundId);
    }

    @Operation(summary = "결제 ID로 환불 목록 조회", description = "해당 결제 ID에 연결된 환불 내역을 모두 조회합니다.")
    @GetMapping("/payment/{paymentId}")
    public List<Refund> getRefundsByPaymentId(@PathVariable Integer paymentId) {
        return refundServuce.getRefundsByPaymentId(paymentId);
    }

    @Operation(summary = "환불 상태로 조회", description = "환불 상태(예: 완료, 대기 등)를 기준으로 환불 목록을 필터링합니다.")
    @GetMapping("/status")
    public List<Refund> getRefundsByStatus(@RequestParam String status) {
        return refundServuce.getRefundsByStatus(status);
    }

    @Operation(summary = "환불일 범위로 조회", description = "지정된 시작일과 종료일 사이의 환불 내역을 조회합니다. (LocalDateTime 사용)")
    @GetMapping("/date-range")
    public List<Refund> getRefundsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return refundServuce.getRefundsByDateRange(start, end);
    }

    @Operation(summary = "결제 ID + 상태로 환불 조회", description = "결제 ID와 환불 상태를 기준으로 해당 환불 정보를 조회합니다.")
    @GetMapping("/payment/{paymentId}/status")
    public List<Refund> getRefundsByPaymentIdAndStatus(@PathVariable Integer paymentId,
                                                       @RequestParam String status) {
        return refundServuce.getRefundsByPaymentIdAndStatus(paymentId, status);
    }
}