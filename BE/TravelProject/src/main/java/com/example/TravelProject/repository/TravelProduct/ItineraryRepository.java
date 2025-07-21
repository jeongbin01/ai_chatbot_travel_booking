package com.example.TravelProject.repository.TravelProduct;

import com.example.TravelProject.entity.travelproduct.Itinerary;
import com.example.TravelProject.entity.travelproduct.TravelProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, Integer> {
    List<Itinerary> findByProductOrderByDayNumberAsc(TravelProduct product);
}
