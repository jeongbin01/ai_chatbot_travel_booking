package com.example.TravelProject.dto.Travelproduct;

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
public class IncludedServiceDto {
    private Integer productId;
    private Integer serviceId;
}