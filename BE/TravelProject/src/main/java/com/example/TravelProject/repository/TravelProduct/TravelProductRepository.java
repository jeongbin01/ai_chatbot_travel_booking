package com.example.TravelProject.Repository.TravelProduct;

import com.example.TravelProject.entity.TravelProduct.TravelProduct;
import com.example.TravelProject.entity.UserAccount.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface TravelProductRepository extends JpaRepository<TravelProduct, Integer> {
    List<TravelProduct> findByOwner(User owner);
    List<TravelProduct> findByIsActiveTrue();
}