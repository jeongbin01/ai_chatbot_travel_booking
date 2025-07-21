package com.example.TravelProject.entity.review;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review_image")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer imageId;

    @ManyToOne
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @Column(nullable = false)
    private String imageUrl;

    private String caption;
}
