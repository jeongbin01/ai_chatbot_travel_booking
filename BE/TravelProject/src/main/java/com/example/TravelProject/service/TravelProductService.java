package com.example.TravelProject.Service;

import com.example.TravelProject.Repository.TravelProduct.TravelProductRepository;
import com.example.TravelProject.entity.TravelProduct.TravelProduct;
import com.example.TravelProject.entity.UserAccount.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TravelProductService {

    private final TravelProductRepository travelProductRepository;

    // Create
    public TravelProduct createProduct(TravelProduct product) {
        return travelProductRepository.save(product);
    }

    // Read All
    public List<TravelProduct> getAllProducts() {
        return travelProductRepository.findAll();
    }

    // Read by ID
    public Optional<TravelProduct> getProductById(Integer id) {
        return travelProductRepository.findById(id);
    }

    // Read by Owner
    public List<TravelProduct> getProductsByOwner(User owner) {
        return travelProductRepository.findByOwner(owner);
    }

    // Update
    public TravelProduct updateProduct(Integer id, TravelProduct updatedProduct) {
        return travelProductRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setDescription(updatedProduct.getDescription());
            product.setBasePrice(updatedProduct.getBasePrice());
            product.setCategory(updatedProduct.getCategory());
            product.setDestination(updatedProduct.getDestination());
            product.setLastUpdatedDate(updatedProduct.getLastUpdatedDate());
            return travelProductRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다. ID: " + id));
    }

    // Delete
    public void deleteProduct(Integer id) {
        if (travelProductRepository.existsById(id)) {
            travelProductRepository.deleteById(id);
        } else {
            throw new RuntimeException("삭제할 상품을 찾을 수 없습니다. ID: " + id);
        }
    }
}
