//package com.example.TravelProject.service.Booking;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.example.TravelProject.dto.Booking.BookingDTO;
//import com.example.TravelProject.entity.Booking.Booking;
//import com.example.TravelProject.entity.Room.Accommodation;
//import com.example.TravelProject.entity.Room.RoomType;
//import com.example.TravelProject.entity.TravelProduct.ProductSchedule;
//import com.example.TravelProject.entity.TravelProduct.TravelProduct;
//import com.example.TravelProject.entity.UserAccount.User;
//import com.example.TravelProject.repository.Booking.BookingRepository;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class BookingServuce {
//
//    private final BookingRepository bookingRepository;
//
//    /**
//     * 전체 예약 목록 조회
//     */
//    public List<BookingDTO> getAllBookings() {
//        return bookingRepository.findAll()
//                .stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    /**
//     * ID로 예약 단건 조회
//     */
//    public BookingDTO getBookingById(Long id) {
//        return bookingRepository.findById(id)
//                .map(this::convertToDTO)
//                .orElse(null);
//    }
//
//    /**
//     * 예약 생성
//     */
//    @Transactional
//    public BookingDTO createBooking(BookingDTO dto) {
//        Booking booking = Booking.builder()
//                .user(User.builder().userId(dto.getUserId()).build())  // user는 userId만 사용 (실제 사용 시엔 UserService 연동 권장)
//                .accommodation(Accommodation.builder().accommodationId(dto.getAccommodationId()).build())
//                .roomType(RoomType.builder().roomTypeId(dto.getRoomTypeId()).build())
//                .travelProduct(TravelProduct.builder().travelProductId(dto.getTravelProductId()).build())
//                .schedule(ProductSchedule.builder().scheduleId(dto.getScheduleId()).build())
//                .bookingType(dto.getBookingType())
//                .checkInDate(dto.getCheckInDate())
//                .checkOutDate(dto.getCheckOutDate())
//                .numAdults(dto.getNumAdults())
//                .numChildren(dto.getNumChildren())
//                .totalAmount(dto.getTotalAmount())
//                .currency(dto.getCurrency())
//                .bookingDate(LocalDateTime.now())
//                .status("CONFIRMED")
//                .requestNotes(dto.getRequestNotes())
//                .build();
//
//        Booking saved = bookingRepository.save(booking);
//        return convertToDTO(saved);
//    }
//
//    /**
//     * 예약 취소
//     */
//    @Transactional
//    public BookingDTO cancelBooking(Long bookingId, String reason) {
//        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
//        if (optionalBooking.isEmpty()) return null;
//
//        Booking booking = optionalBooking.get();
//        booking.setStatus("CANCELLED");
//        booking.setCancellationDate(LocalDateTime.now());
//        booking.setRequestNotes(reason);
//        bookingRepository.save(booking);
//
//        return convertToDTO(booking);
//    }
//
//    /**
//     * Booking Entity → DTO 변환
//     */
//    private BookingDTO convertToDTO(Booking booking) {
//        return BookingDTO.builder()
//                .bookingId(booking.getBookingId())
//                .userId(booking.getUser().getUserId())
//                .accommodationId(booking.getAccommodation() != null ? booking.getAccommodation().getAccommodationId() : null)
//                .roomTypeId(booking.getRoomType() != null ? booking.getRoomType().getRoomTypeId() : null)
//                .travelProductId(booking.getTravelProduct() != null ? booking.getTravelProduct().getTravelProductId() : null)
//                .scheduleId(booking.getSchedule() != null ? booking.getSchedule().getScheduleId() : null)
//                .bookingType(booking.getBookingType())
//                .checkInDate(booking.getCheckInDate())
//                .checkOutDate(booking.getCheckOutDate())
//                .numAdults(booking.getNumAdults())
//                .numChildren(booking.getNumChildren())
//                .totalAmount(booking.getTotalAmount())
//                .currency(booking.getCurrency())
//                .bookingDate(booking.getBookingDate())
//                .status(booking.getStatus())
//                .requestNotes(booking.getRequestNotes())
//                .cancellationDate(booking.getCancellationDate())
//                .cancellationFee(booking.getCancellationFee())
//                .build();
//    }
//}
