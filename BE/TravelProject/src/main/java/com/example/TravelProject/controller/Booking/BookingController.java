package com.example.TravelProject.controller.Booking;

import com.example.TravelProject.entity.Booking.Booking;
import com.example.TravelProject.repository.Booking.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingController {

    private final BookingRepository bookingRepository;

    // 예약 ID로 조회
    public Optional<Booking> getBookingById(Integer bookingId) {
        return bookingRepository.findByBookingId(bookingId);
    }

    // 사용자 ID로 예약 목록 조회
    public List<Booking> getBookingsByUserId(Integer userId) {
        return bookingRepository.findByUser_UserId(userId);
    }

    // 숙소 ID로 예약 목록 조회
    public List<Booking> getBookingsByAccommodationId(Integer accommodationId) {
        return bookingRepository.findByAccommodation_AccommodationId(accommodationId);
    }

    // 룸타입 ID로 예약 목록 조회
    public List<Booking> getBookingsByRoomTypeId(Integer roomTypeId) {
        return bookingRepository.findByRoomType_RoomTypeId(roomTypeId);
    }

    // 상태로 예약 목록 필터링
    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }

    // 체크인 날짜 범위로 예약 조회
    public List<Booking> getBookingsBetweenDates(LocalDate start, LocalDate end) {
        return bookingRepository.findByCheckInDateBetween(start, end);
    }

    // 사용자 ID + 상태로 예약 목록 조회
    public List<Booking> getBookingsByUserIdAndStatus(Integer userId, String status) {
        return bookingRepository.findByUser_UserIdAndStatus(userId, status);
    }

    // 숙소 ID + 체크인 날짜로 예약 목록 조회
    public List<Booking> getBookingsByAccommodationIdAndCheckInDate(Integer accommodationId, LocalDate checkInDate) {
        return bookingRepository.findByAccommodation_AccommodationIdAndCheckInDate(accommodationId, checkInDate);
    }

    // 상태 기준으로 최신순 예약 목록 조회
    public List<Booking> getRecentBookingsByStatus(String status) {
        return bookingRepository.findByStatusOrderByBookingDateDesc(status);
    }
}
