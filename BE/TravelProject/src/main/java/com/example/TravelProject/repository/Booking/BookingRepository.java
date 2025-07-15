package com.example.TravelProject.repository.Booking;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Booking.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // 예약 ID로 조회
    Optional<Booking> findByBookingId(Integer bookingId);

    // 특정 사용자의 예약 전체 조회
    List<Booking> findByUser_UserId(Integer userId);

    // 특정 숙소에서 예약 전체 조회
    List<Booking> findByAccommodation_AccommodationId(Integer accommodationId);

    // 특정 룸타입 예약 조회
    List<Booking> findByRoomType_RoomTypeId(Integer roomTypeId);

    // 상태 예약 필터링
    List<Booking> findByStatus(String status);

    // 체크인~체크아웃 사이의 예약 조회
    List<Booking> findByCheckInDateBetween(LocalDate start, LocalDate end);

    // 특정 유저 + 상태로 예약 조회
    List<Booking> findByUser_UserIdAndStatus(Integer userId, String status);

    // 특정 숙소 + 체크인 날짜로 조회
    List<Booking> findByAccommodation_AccommodationIdAndCheckInDate(Integer accommodationId, LocalDate checkInDate);

    // 예약 상태 + 날짜 기준 정렬해서 조회
    List<Booking> findByStatusOrderByBookingDateDesc(String status);
}
