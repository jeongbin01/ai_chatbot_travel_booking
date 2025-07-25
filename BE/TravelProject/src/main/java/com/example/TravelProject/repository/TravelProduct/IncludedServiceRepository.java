package com.example.TravelProject.repository.TravelProduct;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Travelproduct.IncludedService;
import com.example.TravelProject.entity.Travelproduct.Service;
import com.example.TravelProject.entity.Travelproduct.TravelProduct;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncludedServiceRepository extends JpaRepository<IncludedService, Integer> {
    List<IncludedService> findByProduct(TravelProduct product);
    List<IncludedService> findByTravelService(Service service);
    Optional<IncludedService> findByProductAndTravelService(TravelProduct product, Service travelService);
}
