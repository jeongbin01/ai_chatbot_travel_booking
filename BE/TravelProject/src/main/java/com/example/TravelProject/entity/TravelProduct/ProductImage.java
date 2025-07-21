package com.example.TravelProject.entity.TravelProduct;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_image")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer imageId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private TravelProduct product;

    @Column(nullable = false)
    private String imageUrl;

    private String caption;
    @Builder.Default
    private Integer orderNum = 0;
}

