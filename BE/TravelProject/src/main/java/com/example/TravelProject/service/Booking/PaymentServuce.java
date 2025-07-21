package com.example.TravelProject.service.booking;

import com.example.TravelProject.entity.booking.Payment;
import com.example.TravelProject.repository.booking.PaymentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentServuce {

    private final PaymentRepository paymentRepository;
    // 결제 ID로 조회
    public Optional<Payment> getPaymentById(Integer paymentId) {
        return paymentRepository.findByPaymentId(paymentId);
    }

    // 트랜잭션 ID로 조회
    public Optional<Payment> getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }

    // 사용자 ID로 결제 목록 조회
    public List<Payment> getPaymentsByUserId(Integer userId) {
        return paymentRepository.findByUser_UserId(userId);
    }

    // 예약 ID로 결제 목록 조회
    public List<Payment> getPaymentsByBookingId(Integer bookingId) {
        return paymentRepository.findByBooking_BookingId(bookingId);
    }

    // 결제 상태로 필터링
    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatus(status);
    }

    // 결제일 범위로 조회
    public List<Payment> getPaymentsByDateRange(LocalDateTime start, LocalDateTime end) {
        return paymentRepository.findByPaymentDateBetween(start, end);
    }

    // 사용자 ID + 상태로 결제 목록 조회
    public List<Payment> getPaymentsByUserIdAndStatus(Integer userId, String status) {
        return paymentRepository.findByUser_UserIdAndStatus(userId, status);
    }
}