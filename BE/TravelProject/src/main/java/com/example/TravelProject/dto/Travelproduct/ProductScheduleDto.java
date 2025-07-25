package com.example.TravelProject.dto.Travelproduct;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class ProductScheduleDto {
    private Integer scheduleId;
    private Integer productId;
    private LocalDate departureDate;
    private LocalDate returnDate;
    private BigDecimal currentPrice;
    private Integer availableSlots;
    private String status;
}
