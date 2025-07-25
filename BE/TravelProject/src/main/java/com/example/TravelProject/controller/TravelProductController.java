package com.example.TravelProject.controller;

import com.example.TravelProject.entity.Travelproduct.TravelProduct;
import com.example.TravelProject.service.TravelProductService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/products")
@RequiredArgsConstructor
public class TravelProductController {

    private final TravelProductService travelProductService;

    @PostMapping
    public ResponseEntity<TravelProduct> create(@RequestBody TravelProduct product) {
        return ResponseEntity.ok(travelProductService.createProduct(product));
    }

    @GetMapping
    public ResponseEntity<List<TravelProduct>> getAll() {
        return ResponseEntity.ok(travelProductService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TravelProduct> getById(@PathVariable Integer id) {
        return travelProductService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TravelProduct> update(@PathVariable Integer id, @RequestBody TravelProduct product) {
        return ResponseEntity.ok(travelProductService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        travelProductService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
