package com.example.TravelProject.repository.TravelProduct;

import com.example.TravelProject.entity.travelproduct.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Integer> {

}
