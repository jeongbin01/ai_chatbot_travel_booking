package com.example.TravelProject.entity.Room;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "room_amenity",
    uniqueConstraints = @UniqueConstraint(columnNames = {"room_type_id", "amenity_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomAmenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amenity_id", nullable = false)
    private Amenity amenity;
}
