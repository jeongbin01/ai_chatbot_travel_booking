package com.example.TravelProject.entity.booking;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.TravelProject.entity.useraccount.User;

@Entity
@Table(name = "payment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private BigDecimal amount;
    @Builder.Default
    private String currency = "KRW";

    private String paymentMethod;
    @Builder.Default
    private LocalDateTime paymentDate = LocalDateTime.now();

    @Column(unique = true)
    private String transactionId;

    private String status;
}
