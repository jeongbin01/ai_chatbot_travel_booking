package com.example.TravelProject.entity.Travelproduct;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "included_service",
        uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "service_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncludedService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private TravelProduct product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service travelService;
}
