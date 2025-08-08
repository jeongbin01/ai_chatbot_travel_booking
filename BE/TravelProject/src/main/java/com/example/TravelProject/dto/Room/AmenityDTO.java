package com.example.TravelProject.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmenityDTO {

	// 편의시설 ID
    private Integer amenityId;

    // 편의시설 이름
    private String name;
}