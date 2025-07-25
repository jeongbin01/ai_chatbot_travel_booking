package com.example.TravelProject.dto.Travelproduct;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter 
@Setter
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class TravelProductDto {
    private Integer productId;
    private Integer ownerId;

    private String name;
    private String description;
    private String category;
    private String destination;

    private Integer durationDays;
    private Integer durationNights;
    private String inclusion;
    private String exclusion;

    private BigDecimal basePrice;
    private Integer minParticipants;
    private Integer maxParticipants;
    private String currency;

    private Boolean isActive;
    private LocalDateTime registrationDate;
    private LocalDateTime lastUpdatedDate;
}