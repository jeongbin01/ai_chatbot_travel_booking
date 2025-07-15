package com.example.TravelProject.repository.Booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Booking.Booking;


@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // 필요시 커스텀 메서드 추가
}
