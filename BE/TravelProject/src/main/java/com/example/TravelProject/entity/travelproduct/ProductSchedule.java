package com.example.TravelProject.entity.travelproduct;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "product_schedule")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer scheduleId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private TravelProduct product;

    @Column(nullable = false)
    private LocalDate departureDate;

    @Column(nullable = false)
    private LocalDate returnDate;

    @Column(nullable = false)
    private BigDecimal currentPrice;

    @Column(nullable = false)
    private Integer availableSlots;

    private String status;
}
