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
public class ServiceResponseDTO {

    private Integer serviceId;
    private String name;
    private String description;
}