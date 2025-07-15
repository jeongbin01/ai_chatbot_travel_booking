package com.example.TravelProject.repository.Booking;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Booking.BookingGuest;

@Repository
public interface BookingGuestRepository extends JpaRepository<BookingGuest, Integer> {

    // 게스트 ID로 조회
    Optional<BookingGuest> findByGuestId(Integer guestId);

    // 예약 ID로 게스트 목록 조회
    List<BookingGuest> findByBooking_BookingId(Integer bookingId);

    // 예약 ID로 대표 연락자 조회
    Optional<BookingGuest> findByBooking_BookingIdAndIsPrimaryContactTrue(Integer bookingId);

    // 이름 또는 성으로 게스트 검색
    List<BookingGuest> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);

    // 이메일로 게스트 조회
    Optional<BookingGuest> findByContactEmail(String contactEmail);
}
