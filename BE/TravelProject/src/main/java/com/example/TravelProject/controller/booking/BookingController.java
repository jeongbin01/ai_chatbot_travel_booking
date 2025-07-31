package com.example.TravelProject.controller.booking;

import com.example.TravelProject.entity.booking.Booking;
import com.example.TravelProject.service.Booking.BookingService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @Operation(summary = "전체 예약 조회", description = "모든 예약 정보를 리스트로 반환합니다.")
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @Operation(summary = "예약 ID로 단건 조회", description = "예약 ID를 기반으로 예약 정보를 반환합니다.")
    @GetMapping("/{id}")
    public Optional<Booking> getBookingById(@PathVariable("id") Integer id) {
        return bookingService.getBookingById(id);
    }

    @Operation(summary = "사용자 ID로 예약 조회", description = "사용자 ID로 해당 사용자의 예약 목록을 조회합니다.")
    @GetMapping("/user/{userId}")
    public List<Booking> getByUserId(@PathVariable("userId") Integer userId) {
        return bookingService.getBookingsByUserId(userId);
    }

    @Operation(summary = "숙소 ID로 예약 조회", description = "숙소 ID로 해당 숙소의 예약 목록을 조회합니다.")
    @GetMapping("/accommodation/{accommodationId}")
    public List<Booking> getByAccommodationId(@PathVariable("accommodationId") Integer accommodationId) {
        return bookingService.getBookingsByAccommodationId(accommodationId);
    }

    @Operation(summary = "룸타입 ID로 예약 조회", description = "룸타입 ID로 해당 룸타입의 예약 목록을 조회합니다.")
    @GetMapping("/room-type/{roomTypeId}")
    public List<Booking> getByRoomTypeId(@PathVariable("roomTypeId") Integer roomTypeId) {
        return bookingService.getBookingsByRoomTypeId(roomTypeId);
    }

    @Operation(summary = "예약 상태별 조회", description = "예약 상태(예: 예약완료, 취소 등)를 기준으로 예약 목록을 조회합니다.")
    @GetMapping("/status/{status}")
    public List<Booking> getByStatus(@PathVariable("status") String status) {
        return bookingService.getBookingsByStatus(status);
    }

    @Operation(summary = "날짜 범위로 예약 조회", description = "시작일과 종료일 사이의 예약 정보를 조회합니다.")
    @GetMapping("/date")
    public List<Booking> getByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return bookingService.getBookingsBetweenDates(start, end);
    }

    @Operation(summary = "사용자 ID + 상태로 예약 조회", description = "사용자 ID와 예약 상태를 동시에 조건으로 하여 예약 목록을 조회합니다.")
    @GetMapping("/user/{userId}/status/{status}")
    public List<Booking> getByUserIdAndStatus(@PathVariable("userId") Integer userId, @PathVariable("status") String status) {
        return bookingService.getBookingsByUserIdAndStatus(userId, status);
    }

    @Operation(summary = "숙소 ID + 체크인 날짜로 예약 조회", description = "숙소 ID와 체크인 날짜를 기준으로 예약 목록을 조회합니다.")
    @GetMapping("/accommodation/{accommodationId}/checkin")
    public List<Booking> getByAccommodationAndCheckinDate(
            @PathVariable("accommodationId") Integer accommodationId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate) {
        return bookingService.getBookingsByAccommodationIdAndCheckInDate(accommodationId, checkInDate);
    }

    @Operation(summary = "상태 기준 최신 예약 조회", description = "특정 상태를 가진 예약 중 최근 예약들을 조회합니다.")
    @GetMapping("/recent/{status}")
    public List<Booking> getRecentByStatus(@PathVariable("status") String status) {
        return bookingService.getRecentBookingsByStatus(status);
    }

    @Operation(summary = "예약 등록", description = "새로운 예약을 등록합니다.")
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.saveBooking(booking);
    }

    @Operation(summary = "예약 수정", description = "기존 예약 정보를 수정합니다.")
    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable("id") Integer id, @RequestBody Booking updatedBooking) {
        return bookingService.updateBooking(id, updatedBooking);
    }

    @Operation(summary = "예약 삭제", description = "예약 ID를 기준으로 해당 예약을 삭제합니다.")
    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable("id") Integer id) {
        bookingService.deleteBooking(id);
    }
}