package com.example.TravelProject.dto.travelproduct;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor 
@AllArgsConstructor @Builder
public class ItineraryDto {
    private Integer itineraryId;
    private Integer productId;

    private Integer dayNumber;
    private String title;
    private String description;
    private String location;
    private BigDecimal latitude;
    private BigDecimal longitude;
}