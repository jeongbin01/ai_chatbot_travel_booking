package com.example.TravelProject.dto.travelproduct;

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
public class ServiceDto {
    private Integer serviceId;
    private String name;
    private String description;
}
