package com.example.TravelProject.entity.Room;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @Column(name = "room_number")
    private String roomNumber;

    @Builder.Default
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;
}
