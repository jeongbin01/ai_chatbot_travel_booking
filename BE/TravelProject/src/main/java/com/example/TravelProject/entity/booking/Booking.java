package com.example.TravelProject.entity.booking;

import com.example.TravelProject.entity.Travelproduct.ProductSchedule;
import com.example.TravelProject.entity.Travelproduct.TravelProduct;
import com.example.TravelProject.entity.room.Accommodation;
import com.example.TravelProject.entity.room.RoomType;
import com.example.TravelProject.entity.useraccount.User;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "accommodation_id")
    private Accommodation accommodation;

    @ManyToOne
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private TravelProduct travelProduct;

    @ManyToOne
    @JoinColumn(name = "schedule_id")
    private ProductSchedule schedule;

    private String bookingType;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    @Builder.Default
    @Column(nullable = false)
    private Integer numAdults = 1;
    @Builder.Default
    private Integer numChildren = 0;

    @Column(nullable = false)
    private BigDecimal totalAmount;
    @Builder.Default
    private String currency = "KRW";
    @Builder.Default
    private LocalDateTime bookingDate = LocalDateTime.now();

    private String status;

    @Column(columnDefinition = "TEXT")
    private String requestNotes;

    private LocalDateTime cancellationDate;
    @Builder.Default
    private BigDecimal cancellationFee = BigDecimal.ZERO;
}
