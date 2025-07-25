package com.example.TravelProject.entity.review;

import com.example.TravelProject.entity.Travelproduct.TravelProduct;
import com.example.TravelProject.entity.booking.Booking;
import com.example.TravelProject.entity.room.Accommodation;
import com.example.TravelProject.entity.useraccount.User;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "review")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "accommodation_id")
    private Accommodation accommodation;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private TravelProduct product;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(nullable = false)
    private Integer rating; // 1~5점

    @Column(columnDefinition = "TEXT")
    private String comment;
    @Builder.Default
    private LocalDateTime reviewDate = LocalDateTime.now();
    @Builder.Default
    private Boolean isApproved = false;
    @Builder.Default
    private Integer helpfulCount = 0;
}
