package com.example.TravelProject.controller.booking;

import com.example.TravelProject.entity.booking.Payment;
import com.example.TravelProject.service.Booking.PaymentServuce;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/payment")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // 필요 없으면 제거
public class PaymentController {

    private final PaymentServuce paymentServuce; // NOTE: 프로젝트 클래스명이 'PaymentServuce'라서 그대로 둠

    @Operation(summary = "결제 ID로 조회", description = "결제 ID를 기반으로 결제 정보를 조회합니다.")
    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable("paymentId") Integer paymentId) {
        Optional<Payment> opt = paymentServuce.getPaymentById(paymentId);
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "트랜잭션 ID로 조회", description = "결제 트랜잭션 ID를 통해 결제 정보를 조회합니다.")
    @GetMapping("/transaction")
    public ResponseEntity<Payment> getPaymentByTransactionId(@RequestParam("transactionId") String transactionId) {
        Optional<Payment> opt = paymentServuce.getPaymentByTransactionId(transactionId);
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "사용자 ID로 결제 내역 조회", description = "해당 사용자 ID로 결제 내역 리스트를 조회합니다.")
    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentsByUserId(@PathVariable("userId") Integer userId) {
        return paymentServuce.getPaymentsByUserId(userId);
    }

    @Operation(summary = "예약 ID로 결제 내역 조회", description = "해당 예약 ID로 연결된 결제 내역을 조회합니다.")
    @GetMapping("/booking/{bookingId}")
    public List<Payment> getPaymentsByBookingId(@PathVariable("bookingId") Integer bookingId) {
        return paymentServuce.getPaymentsByBookingId(bookingId);
    }

    @Operation(summary = "결제 상태로 조회", description = "결제 상태(예: 완료, 취소 등)를 기준으로 결제 내역을 조회합니다.")
    @GetMapping("/status")
    public List<Payment> getPaymentsByStatus(@RequestParam("status") String status) {
        return paymentServuce.getPaymentsByStatus(status);
    }

    @Operation(summary = "결제일 범위로 조회", description = "시작일과 종료일 사이의 결제 내역을 조회합니다. (LocalDateTime 사용)")
    @GetMapping("/date-range")
    public List<Payment> getPaymentsByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam("end")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return paymentServuce.getPaymentsByDateRange(start, end);
    }

    @Operation(summary = "사용자 ID + 상태로 결제 조회", description = "사용자 ID와 결제 상태를 동시에 조건으로 결제 내역을 조회합니다.")
    @GetMapping("/user/{userId}/status")
    public List<Payment> getPaymentsByUserIdAndStatus(
            @PathVariable("userId") Integer userId,
            @RequestParam("status") String status) {
        return paymentServuce.getPaymentsByUserIdAndStatus(userId, status);
    }
}
