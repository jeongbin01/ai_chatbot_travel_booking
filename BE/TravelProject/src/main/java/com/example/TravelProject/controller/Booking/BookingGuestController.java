package com.example.TravelProject.controller.Booking;

import com.example.TravelProject.entity.Booking.BookingGuest;
import com.example.TravelProject.service.Booking.BookingGuestServuce;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/booking-guest")
@RequiredArgsConstructor
public class BookingGuestController {

    private final BookingGuestServuce bookingGuestServuce;

    // 게스트 ID로 조회
    @GetMapping("/{guestId}")
    public Optional<BookingGuest> getGuestById(@PathVariable Integer guestId) {
        return bookingGuestServuce.getGuestById(guestId);
    }

    // 예약 ID로 모든 게스트 조회
    @GetMapping("/booking/{bookingId}")
    public List<BookingGuest> getGuestsByBookingId(@PathVariable Integer bookingId) {
        return bookingGuestServuce.getGuestsByBookingId(bookingId);
    }

    // 대표 연락자 조회
    @GetMapping("/booking/{bookingId}/primary-contact")
    public Optional<BookingGuest> getPrimaryContactByBookingId(@PathVariable Integer bookingId) {
        return bookingGuestServuce.getPrimaryContactByBookingId(bookingId);
    }

    // 이름 또는 성으로 검색
    @GetMapping("/search")
    public List<BookingGuest> searchGuestsByName(@RequestParam String name) {
        return bookingGuestServuce.searchGuestsByName(name);
    }

    // 이메일로 조회
    @GetMapping("/email")
    public Optional<BookingGuest> getGuestByEmail(@RequestParam String email) {
        return bookingGuestServuce.getGuestByEmail(email);
    }
}
