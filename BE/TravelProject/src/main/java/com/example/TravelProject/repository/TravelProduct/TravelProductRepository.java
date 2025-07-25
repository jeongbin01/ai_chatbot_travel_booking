package com.example.TravelProject.repository.TravelProduct;

import com.example.TravelProject.entity.Travelproduct.TravelProduct;
import com.example.TravelProject.entity.useraccount.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface TravelProductRepository extends JpaRepository<TravelProduct, Integer> {
    List<TravelProduct> findByOwner(User owner);
    List<TravelProduct> findByIsActiveTrue();
}