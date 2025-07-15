package com.example.TravelProject.service.Booking;

import com.example.TravelProject.entity.Booking.Refund;
import com.example.TravelProject.repository.Booking.RefundRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefundServuce {

	private final RefundRepository refundRepository;
	
    /**
     * 환불 ID로 단일 환불 조회
     */
    public Optional<Refund> getRefundById(Integer refundId) {
        return refundRepository.findByRefundId(refundId);
    }

    /**
     * 결제 ID에 해당하는 환불 목록 조회
     */
    public List<Refund> getRefundsByPaymentId(Integer paymentId) {
        return refundRepository.findByPayment_PaymentId(paymentId);
    }

    /**
     * 환불 상태로 환불 목록 필터링
     */
    public List<Refund> getRefundsByStatus(String status) {
        return refundRepository.findByStatus(status);
    }

    /**
     * 환불 날짜 범위 내 환불 목록 조회
     */
    public List<Refund> getRefundsByDateRange(LocalDateTime start, LocalDateTime end) {
        return refundRepository.findByRefundDateBetween(start, end);
    }

    /**
     * 결제 ID + 상태 조건의 환불 목록 조회
     */
    public List<Refund> getRefundsByPaymentIdAndStatus(Integer paymentId, String status) {
        return refundRepository.findByPayment_PaymentIdAndStatus(paymentId, status);
    }
}