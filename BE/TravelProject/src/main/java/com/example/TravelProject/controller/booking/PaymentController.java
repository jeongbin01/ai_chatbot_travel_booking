package com.example.TravelProject.controller.booking;

import com.example.TravelProject.entity.booking.Payment;
import com.example.TravelProject.service.Booking.PaymentServuce;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentServuce paymentServuce;

    // 결제 ID로 조회
    @GetMapping("/{paymentId}")
    public Optional<Payment> getPaymentById(@PathVariable Integer paymentId) {
        return paymentServuce.getPaymentById(paymentId);
    }

    // 트랜잭션 ID로 조회
    @GetMapping("/transaction")
    public Optional<Payment> getPaymentByTransactionId(@RequestParam String transactionId) {
        return paymentServuce.getPaymentByTransactionId(transactionId);
    }

    // 사용자 ID로 결제 내역 조회
    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentsByUserId(@PathVariable Integer userId) {
        return paymentServuce.getPaymentsByUserId(userId);
    }

    // 예약 ID로 결제 내역 조회
    @GetMapping("/booking/{bookingId}")
    public List<Payment> getPaymentsByBookingId(@PathVariable Integer bookingId) {
        return paymentServuce.getPaymentsByBookingId(bookingId);
    }

    // 결제 상태로 조회
    @GetMapping("/status")
    public List<Payment> getPaymentsByStatus(@RequestParam String status) {
        return paymentServuce.getPaymentsByStatus(status);
    }

    // 결제일 범위 조회
    @GetMapping("/date-range")
    public List<Payment> getPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return paymentServuce.getPaymentsByDateRange(start, end);
    }

    // 사용자 ID + 상태로 결제 조회
    @GetMapping("/user/{userId}/status")
    public List<Payment> getPaymentsByUserIdAndStatus(@PathVariable Integer userId,
                                                      @RequestParam String status) {
        return paymentServuce.getPaymentsByUserIdAndStatus(userId, status);
    }
}
