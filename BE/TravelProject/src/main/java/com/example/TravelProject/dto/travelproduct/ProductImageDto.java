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
public class ProductImageDto {
    private Integer imageId;
    private Integer productId;
    private String imageUrl;
    private String caption;
    private Integer orderNum;
}