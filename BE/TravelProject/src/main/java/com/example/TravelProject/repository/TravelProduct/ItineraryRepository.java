package com.example.TravelProject.repository.TravelProduct;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Travelproduct.Itinerary;
import com.example.TravelProject.entity.Travelproduct.TravelProduct;

import java.util.List;
@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, Integer> {
    List<Itinerary> findByProductOrderByDayNumberAsc(TravelProduct product);
}
