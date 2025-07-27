package com.example.TravelProject.entity.room;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

@Entity
@Table(name = "accommodation_image")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccommodationImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Integer imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accommodation_id", nullable = false)
    private Accommodation accommodation;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    private String caption;

    @Builder.Default
    @Column(name = "order_num")
    private Integer orderNum = 0;
}
