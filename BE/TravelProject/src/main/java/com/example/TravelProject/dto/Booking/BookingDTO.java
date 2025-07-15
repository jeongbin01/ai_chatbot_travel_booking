package com.example.TravelProject.dto.Booking;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime; // 🔹 이거 추가!

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDTO {
    private Integer bookingId;
    
    private Integer userId;
    
    private Integer accommodationId;
    
    private Integer roomTypeId;
    
    private Integer travelProductId;
    
    private Integer scheduleId;

    private String bookingType;

    private LocalDate checkInDate;
    
    private LocalDate checkOutDate;

    private Integer numAdults;
    
    private Integer numChildren;

    private BigDecimal totalAmount;
    
    private String currency;

    private LocalDateTime bookingDate;
    
    private String status;
    
    private String requestNotes;
    
    private LocalDateTime cancellationDate;
    
    private BigDecimal cancellationFee;
}
