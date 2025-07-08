package com.example.TravelProject.entity.TravelProduct;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "itinerary")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Itinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer itineraryId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private TravelProduct product;

    @Column(nullable = false)
    private Integer dayNumber;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    private BigDecimal latitude;
    private BigDecimal longitude;
}