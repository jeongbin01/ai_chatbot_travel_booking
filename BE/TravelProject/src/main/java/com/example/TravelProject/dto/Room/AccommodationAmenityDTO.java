package com.example.TravelProject.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccommodationAmenityDTO {

    private Integer id;              // 매핑 ID (pk)
    private Integer accommodationId; // 숙소 ID
    private Integer amenityId;       // 편의시설 ID
    private String amenityName;      // 편의시설 이름 (선택적 응답용)
}
