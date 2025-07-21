package com.example.TravelProject.Repository.TravelProduct;

import com.example.TravelProject.entity.TravelProduct.ProductImage;
import com.example.TravelProject.entity.TravelProduct.TravelProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProductOrderByOrderNumAsc(TravelProduct product);
}