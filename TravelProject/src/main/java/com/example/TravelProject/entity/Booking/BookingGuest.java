package com.example.TravelProject.entity.Booking;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "booking_guest")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingGuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer guestId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private LocalDate dateOfBirth;

    private String gender;
    private String contactPhone;
    private String contactEmail;
    @Builder.Default
    private Boolean isPrimaryContact = false;
}
