package com.example.TravelProject.service.booking;

import com.example.TravelProject.entity.booking.Refund;
import com.example.TravelProject.repository.booking.RefundRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefundServuce {

	private final RefundRepository refundRepository;
	
    // 환불 ID로 조회
    public Optional<Refund> getRefundById(Integer refundId) {
        return refundRepository.findByRefundId(refundId);
    }

    // 결제 ID로 환불 목록 조회
    public List<Refund> getRefundsByPaymentId(Integer paymentId) {
        return refundRepository.findByPayment_PaymentId(paymentId);
    }

    // 상태로 환불 목록 조회
    public List<Refund> getRefundsByStatus(String status) {
        return refundRepository.findByStatus(status);
    }

    // 환불일 범위로 조회
    public List<Refund> getRefundsByDateRange(LocalDateTime start, LocalDateTime end) {
        return refundRepository.findByRefundDateBetween(start, end);
    }

    // 결제 ID + 상태로 환불 목록 조회
    public List<Refund> getRefundsByPaymentIdAndStatus(Integer paymentId, String status) {
        return refundRepository.findByPayment_PaymentIdAndStatus(paymentId, status);
    }
}