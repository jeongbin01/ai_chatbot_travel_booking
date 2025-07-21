package com.example.TravelProject.entity.TravelProduct;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer serviceId;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
}

