package com.example.TravelProject.dto.Booking;

import java.math.BigDecimal;

import com.example.TravelProject.entity.Booking.Booking;
import com.example.TravelProject.entity.UserAccount.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {

    private Integer paymentId;

    private Booking booking;

    private User user;

    private BigDecimal amount;

    private String paymentMethod;
    
    private String transactionId;

    private String status;
}