package com.example.TravelProject.dto.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccommodationRoomDTO {
    // accommodation 테이블 필드들
    private Integer accommodationId;
    private String address;
    private String checkInTime;           // String으로 받아서 필요시 변환
    private String checkOutTime;          // String으로 받아서 필요시 변환
    private String contact;
    private String description;
    private Boolean isActive;
    private String isDomestic;
    private String latitude;              // String으로 받아서 필요시 변환
    private String longitude;             // String으로 받아서 필요시 변환
    private String name;
    private String ratingAvg;             // String으로 받아서 필요시 변환
    private String registrationDate;      // String으로 받아서 필요시 변환
    private Integer totalReviews;
    private String type;
    private Integer ownerUserId;

    // accommodation_image 테이블 필드
    private String imageUrl;

    // room_type 테이블 필드들
    private Integer roomTypeId;
    private String bedType;
    private String roomDescription;
    private Integer maxOccupancy;
    private String roomName;

    // price_policy 테이블 필드
    private String basePrice;             // String으로 받아서 필요시 변환

    // 편의 메서드들 (필요한 경우)
    public LocalTime getCheckInTimeAsLocalTime() {
        return checkInTime != null ? LocalTime.parse(checkInTime) : null;
    }

    public LocalTime getCheckOutTimeAsLocalTime() {
        return checkOutTime != null ? LocalTime.parse(checkOutTime) : null;
    }

    public Double getLatitudeAsDouble() {
        return latitude != null ? Double.parseDouble(latitude) : null;
    }

    public Double getLongitudeAsDouble() {
        return longitude != null ? Double.parseDouble(longitude) : null;
    }
}
