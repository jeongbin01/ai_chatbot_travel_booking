package com.example.TravelProject.repository.Booking;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Booking.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // 결제 ID로 기준으로 하나의 환불 정보를 조회
    Optional<Payment> findByPaymentId(Integer paymentId);

    // 트랜잭션 ID로 조회 
    Optional<Payment> findByTransactionId(String transactionId);

    // 유저 ID로 해당 유저의 모든 결제 내역 조회
    List<Payment> findByUser_UserId(Integer userId);

    // 특정 예약에 대한 결제 내역 조회
    List<Payment> findByBooking_BookingId(Integer bookingId);

    // 특정 상태로 필터링
    List<Payment> findByStatus(String status);

    // 결제일 범위로 조회 
    List<Payment> findByPaymentDateBetween(LocalDateTime start, LocalDateTime end);

    // 유저 + 상태 조건으로 조회
    List<Payment> findByUser_UserIdAndStatus(Integer userId, String status);
}
