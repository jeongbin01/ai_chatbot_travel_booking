package com.example.TravelProject.repository.travelproduct;

import com.example.TravelProject.entity.travelproduct.ProductImage;
import com.example.TravelProject.entity.travelproduct.TravelProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProductOrderByOrderNumAsc(TravelProduct product);
}