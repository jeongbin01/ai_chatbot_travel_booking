package com.example.TravelProject.dto.accommodation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AccommodationListDTO {
    private Integer id;              // accommodation_id
    private String name;          // 숙소 이름
    private String location;      // address
    private int price;            // price_policy.base_price
    private int capacity;         // room_type.max_occupancy
    private double rating;        // accommodation.rating_avg
    private boolean liked;        // 기본 false (추후 로그인 유저별 즐겨찾기 처리 가능)
    private String image;         // accommodation_image.image_url
}
