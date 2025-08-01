package com.example.TravelProject.entity.room;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
//
//    @ManyToOne
//    @JoinColumn(name = "amenity_id", nullable = false)
//    private Amenity amenity;
}

