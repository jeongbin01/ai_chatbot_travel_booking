package com.example.TravelProject.service.booking;

import com.example.TravelProject.entity.booking.Booking;
import com.example.TravelProject.repository.booking.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    // 🔹 전체 예약 목록 조회
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // 🔹 예약 ID로 단건 조회
    public Optional<Booking> getBookingById(Integer bookingId) {
        return bookingRepository.findByBookingId(bookingId);
    }

    // 🔹 사용자 ID로 예약 목록 조회
    public List<Booking> getBookingsByUserId(Integer userId) {
        return bookingRepository.findByUser_UserId(userId);
    }

    // 🔹 숙소 ID로 예약 목록 조회
    public List<Booking> getBookingsByAccommodationId(Integer accommodationId) {
        return bookingRepository.findByAccommodation_AccommodationId(accommodationId);
    }

    // 🔹 룸타입 ID로 예약 목록 조회
    public List<Booking> getBookingsByRoomTypeId(Integer roomTypeId) {
        return bookingRepository.findByRoomType_RoomTypeId(roomTypeId);
    }

    // 🔹 상태별 예약 목록 조회
    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }

    // 🔹 체크인 날짜 범위로 예약 목록 조회
    public List<Booking> getBookingsBetweenDates(LocalDate start, LocalDate end) {
        return bookingRepository.findByCheckInDateBetween(start, end);
    }

    // 🔹 사용자 ID + 상태로 예약 목록 조회
    public List<Booking> getBookingsByUserIdAndStatus(Integer userId, String status) {
        return bookingRepository.findByUser_UserIdAndStatus(userId, status);
    }

    // 🔹 숙소 ID + 체크인 날짜로 예약 목록 조회
    public List<Booking> getBookingsByAccommodationIdAndCheckInDate(Integer accommodationId, LocalDate checkInDate) {
        return bookingRepository.findByAccommodation_AccommodationIdAndCheckInDate(accommodationId, checkInDate);
    }

    // 🔹 상태 기준으로 최신 예약 목록 조회
    public List<Booking> getRecentBookingsByStatus(String status) {
        return bookingRepository.findByStatusOrderByBookingDateDesc(status);
    }

    // 🔹 예약 등록
    public Booking saveBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    // 🔹 예약 수정
    public Booking updateBooking(Integer id, Booking updatedBooking) {
        Booking existing = bookingRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException("해당 예약이 존재하지 않습니다."));

        existing.setStatus(updatedBooking.getStatus());
        existing.setCheckInDate(updatedBooking.getCheckInDate());
        existing.setCheckOutDate(updatedBooking.getCheckOutDate());
        existing.setRequestNotes(updatedBooking.getRequestNotes());
        existing.setNumAdults(updatedBooking.getNumAdults());
        existing.setNumChildren(updatedBooking.getNumChildren());
        existing.setTotalAmount(updatedBooking.getTotalAmount());
        existing.setCurrency(updatedBooking.getCurrency());
        existing.setAccommodation(updatedBooking.getAccommodation());
        existing.setRoomType(updatedBooking.getRoomType());
        existing.setTravelProduct(updatedBooking.getTravelProduct());
        existing.setSchedule(updatedBooking.getSchedule());

        return bookingRepository.save(existing);
    }

    // 🔹 예약 삭제
    public void deleteBooking(Integer id) {
        if (!bookingRepository.existsById(Long.valueOf(id))) {
            throw new IllegalArgumentException("해당 예약이 존재하지 않습니다.");
        }
        bookingRepository.deleteById(Long.valueOf(id));
    }
}
