package com.example.TravelProject.entity.Room;

import java.io.Serializable;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "accommodation_amenity",
    uniqueConstraints = @UniqueConstraint(columnNames = {"accommodation_id", "amenity_id"})
)
public class AccommodationAmenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "accommodation_id", nullable = false)
    private Accommodation accommodation;

    @ManyToOne
    @JoinColumn(name = "amenity_id", nullable = false)
    private Amenity amenity;
}

