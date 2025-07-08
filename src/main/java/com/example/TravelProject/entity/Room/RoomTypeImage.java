package com.example.TravelProject.entity.Room;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room_type_image")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RoomTypeImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Integer imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    private String caption;

    @Builder.Default
    @Column(name = "order_num")
    private Integer orderNum = 0;
}
