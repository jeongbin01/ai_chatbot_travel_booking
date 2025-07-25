package com.example.TravelProject.controller.Travelproduct;

import com.example.TravelProject.dto.Travelproduct.ProductImageDto;
import com.example.TravelProject.entity.Travelproduct.ProductImage;
import com.example.TravelProject.service.TravelProduct.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/product-images")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService productImageService;

    /**
     * 이미지 생성
     * POST /api/product-images
     */
    @PostMapping
    public ResponseEntity<ProductImage> createProductImage(@RequestBody ProductImageDto dto) {
        ProductImage created = productImageService.createProductImage(dto);
        return ResponseEntity.ok(created);
    }

    /**
     * 전체 이미지 조회
     * GET /api/product-images
     */
    @GetMapping
    public ResponseEntity<List<ProductImage>> getAllProductImages() {
        List<ProductImage> list = productImageService.getAllProductImages();
        return ResponseEntity.ok(list);
    }

    /**
     * ID로 이미지 조회
     * GET /api/product-images/{imageId}
     */
    @GetMapping("/{imageId}")
    public ResponseEntity<ProductImage> getProductImageById(@PathVariable Integer imageId) {
        ProductImage img = productImageService.getProductImageById(imageId);
        return ResponseEntity.ok(img);
    }

    /**
     * 상품별 이미지 조회
     * GET /api/product-images/product/{productId}
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImage>> getProductImagesByProductId(@PathVariable Integer productId) {
        List<ProductImage> list = productImageService.getProductImagesByProductId(productId);
        return ResponseEntity.ok(list);
    }

    /**
     * 이미지 수정
     * PUT /api/product-images/{imageId}
     */
    @PutMapping("/{imageId}")
    public ResponseEntity<ProductImage> updateProductImage(
            @PathVariable Integer imageId,
            @RequestBody ProductImageDto dto
    ) {
        ProductImage updated = productImageService.updateProductImage(imageId, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * 이미지 삭제
     * DELETE /api/product-images/{imageId}
     */
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable Integer imageId) {
        productImageService.deleteProductImage(imageId);
        return ResponseEntity.noContent().build();
    }
}
