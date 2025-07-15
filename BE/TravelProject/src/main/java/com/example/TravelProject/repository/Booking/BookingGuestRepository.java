package com.example.TravelProject.repository.Booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Booking.BookingGuest;

@Repository
public interface BookingGuestRepository extends JpaRepository<BookingGuest, Long> {
    // 필요 시 커스텀 메서드 추가
}
