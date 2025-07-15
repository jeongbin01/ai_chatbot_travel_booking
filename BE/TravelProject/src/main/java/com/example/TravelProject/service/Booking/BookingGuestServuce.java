package com.example.TravelProject.service.Booking;

import com.example.TravelProject.entity.Booking.BookingGuest;
import com.example.TravelProject.repository.Booking.BookingGuestRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingGuestServuce {

    private final BookingGuestRepository bookingGuestRepository;

    /**
     * guestId로 단일 게스트 조회
     */
    public Optional<BookingGuest> getGuestById(Integer guestId) {
        return bookingGuestRepository.findByGuestId(guestId);
    }

    /**
     * 예약 ID로 모든 게스트 조회
     */
    public List<BookingGuest> getGuestsByBookingId(Integer bookingId) {
        return bookingGuestRepository.findByBooking_BookingId(bookingId);
    }

    /**
     * 예약 ID 내 대표 연락자 조회
     */
    public Optional<BookingGuest> getPrimaryContactByBookingId(Integer bookingId) {
        return bookingGuestRepository.findByBooking_BookingIdAndIsPrimaryContactTrue(bookingId);
    }

    /**
     * 이름 또는 성에 일치하는 게스트 검색
     */
    public List<BookingGuest> searchGuestsByName(String name) {
        return bookingGuestRepository.findByFirstNameContainingOrLastNameContaining(name, name);
    }

    /**
     * 이메일로 게스트 조회
     */
    public Optional<BookingGuest> getGuestByEmail(String email) {
        return bookingGuestRepository.findByContactEmail(email);
    }
}