package com.example.TravelProject.controller.Travelproduct;

import com.example.TravelProject.entity.Travelproduct.TravelProduct;
import com.example.TravelProject.service.TravelProduct.TravelProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/travel-products")
@RequiredArgsConstructor
public class TravelProductController {

    private final TravelProductService travelProductService;

    /**
     * 새 여행 상품 등록
     * POST /api/travel-products
     */
    @PostMapping
    public ResponseEntity<TravelProduct> createProduct(@RequestBody TravelProduct product) {
        TravelProduct created = travelProductService.createProduct(product);
        return ResponseEntity.ok(created);
    }

    /**
     * 전체 여행 상품 조회
     * GET /api/travel-products
     */
    @GetMapping
    public ResponseEntity<List<TravelProduct>> getAllProducts() {
        List<TravelProduct> list = travelProductService.getAllProducts();
        return ResponseEntity.ok(list);
    }

    /**
     * 단일 여행 상품 조회
     * GET /api/travel-products/{productId}
     */
    @GetMapping("/{productId}")
    public ResponseEntity<TravelProduct> getProductById(@PathVariable Integer productId) {
        TravelProduct product = travelProductService.getProductById(productId);
        return ResponseEntity.ok(product);
    }

    /**
     * 여행 상품 수정
     * PUT /api/travel-products/{productId}
     */
    @PutMapping("/{productId}")
    public ResponseEntity<TravelProduct> updateProduct(
            @PathVariable Integer productId,
            @RequestBody TravelProduct dto
    ) {
        TravelProduct updated = travelProductService.updateProduct(productId, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * 여행 상품 삭제
     * DELETE /api/travel-products/{productId}
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer productId) {
        travelProductService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
}
