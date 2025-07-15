package com.example.TravelProject.dto.Booking;

import java.math.BigDecimal;

import com.example.TravelProject.entity.Booking.Payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundDTO {

    private Integer refundId;

    private Payment payment;

    private BigDecimal refundAmount;
    
    private String status;
}