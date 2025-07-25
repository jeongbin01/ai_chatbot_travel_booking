package com.example.TravelProject.repository.TravelProduct;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Travelproduct.ProductSchedule;
import com.example.TravelProject.entity.Travelproduct.TravelProduct;

import java.time.LocalDate;
import java.util.List;
@Repository
public interface ProductScheduleRepository extends JpaRepository<ProductSchedule, Integer> {
    List<ProductSchedule> findByProduct(TravelProduct product);
    List<ProductSchedule> findByDepartureDateAfter(LocalDate date);
}
