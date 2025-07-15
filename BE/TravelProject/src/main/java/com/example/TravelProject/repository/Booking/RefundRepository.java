package com.example.TravelProject.repository.Booking;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Booking.Refund;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {

    // 환불 ID로 조회
    Optional<Refund> findByRefundId(Integer refundId);

    // 결제 ID로 해당 결제에 대한 환불 내역 조회
    List<Refund> findByPayment_PaymentId(Integer paymentId);

    // 상태로 필터링 
    List<Refund> findByStatus(String status);

    // 환불 날짜 범위로 조회
    List<Refund> findByRefundDateBetween(LocalDateTime start, LocalDateTime end);

    // 특정 결제 ID + 환불 상태로 조회
    List<Refund> findByPayment_PaymentIdAndStatus(Integer paymentId, String status);
}
