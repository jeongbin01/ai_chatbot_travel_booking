package com.example.TravelProject.controller.booking;

import com.example.TravelProject.entity.booking.BookingGuest;
import com.example.TravelProject.service.Booking.BookingGuestServuce;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/booking-guest")
@RequiredArgsConstructor
public class BookingGuestController {

    private final BookingGuestServuce bookingGuestServuce;

    @Operation(summary = "게스트 ID로 조회", description = "게스트의 고유 ID를 통해 해당 게스트 정보를 조회합니다.")
    @GetMapping("/{guestId}")
    public Optional<BookingGuest> getGuestById(@PathVariable("guestId") Integer guestId) {
        return bookingGuestServuce.getGuestById(guestId);
    }

    @Operation(summary = "예약 ID로 게스트 목록 조회", description = "해당 예약에 포함된 모든 게스트 정보를 조회합니다.")
    @GetMapping("/booking/{bookingId}")
    public List<BookingGuest> getGuestsByBookingId(@PathVariable("bookingId") Integer bookingId) {
        return bookingGuestServuce.getGuestsByBookingId(bookingId);
    }

    @Operation(summary = "대표 연락자 조회", description = "해당 예약의 대표 연락자 게스트 정보를 조회합니다.")
    @GetMapping("/booking/{bookingId}/primary-contact")
    public Optional<BookingGuest> getPrimaryContactByBookingId(@PathVariable("bookingId") Integer bookingId) {
        return bookingGuestServuce.getPrimaryContactByBookingId(bookingId);
    }

    @Operation(summary = "이름 또는 성으로 검색", description = "이름 또는 성을 기준으로 게스트를 검색합니다.")
    @GetMapping("/search")
    public List<BookingGuest> searchGuestsByName(@RequestParam String name) {
        return bookingGuestServuce.searchGuestsByName(name);
    }

    @Operation(summary = "이메일로 게스트 조회", description = "이메일 주소를 통해 해당 게스트 정보를 조회합니다.")
    @GetMapping("/email")
    public Optional<BookingGuest> getGuestByEmail(@RequestParam String email) {
        return bookingGuestServuce.getGuestByEmail(email);
    }
}