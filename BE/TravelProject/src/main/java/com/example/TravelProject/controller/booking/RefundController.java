package com.example.TravelProject.controller.booking;

import com.example.TravelProject.entity.booking.Refund;
import com.example.TravelProject.service.Booking.RefundServuce;

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

    // 환불 ID로 조회
    @GetMapping("/{refundId}")
    public Optional<Refund> getRefundById(@PathVariable Integer refundId) {
        return refundServuce.getRefundById(refundId);
    }

    // 결제 ID로 환불 목록 조회
    @GetMapping("/payment/{paymentId}")
    public List<Refund> getRefundsByPaymentId(@PathVariable Integer paymentId) {
        return refundServuce.getRefundsByPaymentId(paymentId);
    }

    // 환불 상태로 필터링
    @GetMapping("/status")
    public List<Refund> getRefundsByStatus(@RequestParam String status) {
        return refundServuce.getRefundsByStatus(status);
    }

    // 환불일 범위로 조회
    @GetMapping("/date-range")
    public List<Refund> getRefundsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return refundServuce.getRefundsByDateRange(start, end);
    }

    // 결제 ID + 상태로 조회
    @GetMapping("/payment/{paymentId}/status")
    public List<Refund> getRefundsByPaymentIdAndStatus(@PathVariable Integer paymentId,
                                                       @RequestParam String status) {
        return refundServuce.getRefundsByPaymentIdAndStatus(paymentId, status);
    }
}
