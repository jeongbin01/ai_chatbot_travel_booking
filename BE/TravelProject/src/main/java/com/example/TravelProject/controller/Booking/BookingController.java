package com.example.TravelProject.controller.Booking;

import com.example.TravelProject.entity.Booking.Booking;
import com.example.TravelProject.service.Booking.BookingService;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // 예약 ID로 조회
    @GetMapping("/{id}")
    public Optional<Booking> getBookingById(@PathVariable Integer id) {
        return bookingService.getBookingById(id);
    }

    // 사용자 ID로 예약 목록 조회
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUserId(@PathVariable Integer userId) {
        return bookingService.getBookingsByUserId(userId);
    }

    // 숙소 ID로 예약 목록 조회
    @GetMapping("/accommodation/{accommodationId}")
    public List<Booking> getBookingsByAccommodationId(@PathVariable Integer accommodationId) {
        return bookingService.getBookingsByAccommodationId(accommodationId);
    }

    // 룸타입 ID로 예약 목록 조회
    @GetMapping("/roomtype/{roomTypeId}")
    public List<Booking> getBookingsByRoomTypeId(@PathVariable Integer roomTypeId) {
        return bookingService.getBookingsByRoomTypeId(roomTypeId);
    }

    // 상태로 예약 목록 필터링
    @GetMapping("/status")
    public List<Booking> getBookingsByStatus(@RequestParam String status) {
        return bookingService.getBookingsByStatus(status);
    }

    // 체크인 날짜 범위로 예약 조회
    @GetMapping("/daterange")
    public List<Booking> getBookingsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return bookingService.getBookingsBetweenDates(start, end);
    }

    // 사용자 ID + 상태로 예약 목록 조회
    @GetMapping("/user/{userId}/status")
    public List<Booking> getBookingsByUserIdAndStatus(
            @PathVariable Integer userId,
            @RequestParam String status) {
        return bookingService.getBookingsByUserIdAndStatus(userId, status);
    }

    // 숙소 ID + 체크인 날짜로 예약 목록 조회
    @GetMapping("/accommodation/{accommodationId}/checkin")
    public List<Booking> getBookingsByAccommodationIdAndCheckInDate(
            @PathVariable Integer accommodationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate) {
        return bookingService.getBookingsByAccommodationIdAndCheckInDate(accommodationId, checkInDate);
    }

    // 상태 기준으로 최신순 예약 목록 조회
    @GetMapping("/recent")
    public List<Booking> getRecentBookingsByStatus(@RequestParam String status) {
        return bookingService.getRecentBookingsByStatus(status);
    }
}
