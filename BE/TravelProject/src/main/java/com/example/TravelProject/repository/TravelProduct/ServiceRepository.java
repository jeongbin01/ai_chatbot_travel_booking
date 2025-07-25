package com.example.TravelProject.repository.TravelProduct;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Travelproduct.Service;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Integer> {

}
