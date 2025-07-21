package com.example.TravelProject.repository.Booking;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.booking.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // 예약 ID로 조회
    Optional<Booking> findByBookingId(Integer bookingId);

    // 사용자 ID로 예약 조회
    List<Booking> findByUser_UserId(Integer userId);

    // 숙소 ID로 예약 조회
    List<Booking> findByAccommodation_AccommodationId(Integer accommodationId);

    // 룸타입 ID로 예약 조회
    List<Booking> findByRoomType_RoomTypeId(Integer roomTypeId);

    // 상태로 예약 조회
    List<Booking> findByStatus(String status);

    // 체크인 날짜 범위로 조회
    List<Booking> findByCheckInDateBetween(LocalDate start, LocalDate end);

    // 사용자 ID + 상태로 예약 조회
    List<Booking> findByUser_UserIdAndStatus(Integer userId, String status);

    // 숙소 ID + 체크인 날짜로 예약 조회
    List<Booking> findByAccommodation_AccommodationIdAndCheckInDate(Integer accommodationId, LocalDate checkInDate);

    // 상태로 정렬된 예약 조회 (최신순)
    List<Booking> findByStatusOrderByBookingDateDesc(String status);
}
