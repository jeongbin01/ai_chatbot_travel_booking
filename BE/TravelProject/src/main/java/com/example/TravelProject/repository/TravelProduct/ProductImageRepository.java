package com.example.TravelProject.repository.TravelProduct;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Travelproduct.ProductImage;
import com.example.TravelProject.entity.Travelproduct.TravelProduct;

import java.util.List;
@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProductOrderByOrderNumAsc(TravelProduct product);
}