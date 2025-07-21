// src/main/java/com/example/TravelProject/controller/booking/BookingController.java
package com.example.TravelProject.controller.booking;

import com.example.TravelProject.entity.booking.Booking;
import com.example.TravelProject.service.booking.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // 1. 전체 예약 조회
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // 2. 예약 ID로 단건 조회
    @GetMapping("/{id}")
    public Optional<Booking> getBookingById(@PathVariable Integer id) {
        return bookingService.getBookingById(id);
    }

    // 3. 사용자 ID로 예약 목록 조회
    @GetMapping("/user/{userId}")
    public List<Booking> getByUserId(@PathVariable Integer userId) {
        return bookingService.getBookingsByUserId(userId);
    }

    // 4. 숙소 ID로 예약 목록 조회
    @GetMapping("/accommodation/{accommodationId}")
    public List<Booking> getByAccommodationId(@PathVariable Integer accommodationId) {
        return bookingService.getBookingsByAccommodationId(accommodationId);
    }

    // 5. 룸타입 ID로 예약 목록 조회
    @GetMapping("/room-type/{roomTypeId}")
    public List<Booking> getByRoomTypeId(@PathVariable Integer roomTypeId) {
        return bookingService.getBookingsByRoomTypeId(roomTypeId);
    }

    // 6. 상태별 예약 목록 조회
    @GetMapping("/status/{status}")
    public List<Booking> getByStatus(@PathVariable String status) {
        return bookingService.getBookingsByStatus(status);
    }

    // 7. 날짜 범위로 예약 목록 조회
    @GetMapping("/date")
    public List<Booking> getByDateRange(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return bookingService.getBookingsBetweenDates(start, end);
    }

    // 8. 사용자 ID + 상태로 예약 목록 조회
    @GetMapping("/user/{userId}/status/{status}")
    public List<Booking> getByUserIdAndStatus(@PathVariable Integer userId,
                                              @PathVariable String status) {
        return bookingService.getBookingsByUserIdAndStatus(userId, status);
    }

    // 9. 숙소 ID + 체크인 날짜로 예약 목록 조회
    @GetMapping("/accommodation/{accommodationId}/checkin")
    public List<Booking> getByAccommodationAndCheckinDate(
            @PathVariable Integer accommodationId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate) {
        return bookingService.getBookingsByAccommodationIdAndCheckInDate(accommodationId, checkInDate);
    }

    // 10. 상태 기준 최신순으로 예약 목록 조회
    @GetMapping("/recent/{status}")
    public List<Booking> getRecentByStatus(@PathVariable String status) {
        return bookingService.getRecentBookingsByStatus(status);
    }

    // 11. 예약 등록
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.saveBooking(booking);
    }

    // 12. 예약 수정
    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Integer id,
                                 @RequestBody Booking updatedBooking) {
        return bookingService.updateBooking(id, updatedBooking);
    }

    // 13. 예약 삭제
    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Integer id) {
        bookingService.deleteBooking(id);
    }
}
