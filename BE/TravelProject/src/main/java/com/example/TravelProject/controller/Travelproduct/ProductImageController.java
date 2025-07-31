package com.example.TravelProject.controller.Travelproduct;

import com.example.TravelProject.dto.Travelproduct.ProductImageDto;
import com.example.TravelProject.entity.Travelproduct.ProductImage;
import com.example.TravelProject.service.TravelProduct.ProductImageService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/product-images")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService productImageService;

    @Operation(
        summary = "상품 이미지 등록",
        description = """
            상품 이미지(ProductImage)를 등록합니다.
            요청 본문에는 productId, 이미지 URL, 순서(orderNum) 등이 포함되어야 합니다.
            """
    )
    @PostMapping
    public ResponseEntity<ProductImage> createProductImage(@RequestBody ProductImageDto dto) {
        ProductImage created = productImageService.createProductImage(dto);
        return ResponseEntity.ok(created);
    }

    @Operation(
        summary = "전체 상품 이미지 목록 조회",
        description = """
            등록된 모든 상품 이미지 정보를 조회합니다.
            어드민이나 테스트용으로 사용할 수 있습니다.
            """
    )
    @GetMapping
    public ResponseEntity<List<ProductImage>> getAllProductImages() {
        List<ProductImage> list = productImageService.getAllProductImages();
        return ResponseEntity.ok(list);
    }

    @Operation(
        summary = "상품 이미지 단건 조회",
        description = """
            이미지 ID(imageId)를 기준으로 상품 이미지 정보를 조회합니다.
            """
    )
    @GetMapping("/{imageId}")
    public ResponseEntity<ProductImage> getProductImageById(@PathVariable("imageId") Integer imageId) {
        ProductImage img = productImageService.getProductImageById(imageId);
        return ResponseEntity.ok(img);
    }

    @Operation(
        summary = "특정 상품의 이미지 목록 조회",
        description = """
            상품 ID(productId)를 기준으로 해당 상품에 연결된 이미지 목록을 조회합니다.
            순서(orderNum) 기준으로 정렬하여 반환될 수 있습니다.
            """
    )
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImage>> getProductImagesByProductId(@PathVariable("productId") Integer productId) {
        List<ProductImage> list = productImageService.getProductImagesByProductId(productId);
        return ResponseEntity.ok(list);
    }

    @Operation(
        summary = "상품 이미지 수정",
        description = """
            이미지 ID(imageId)를 기준으로 기존 상품 이미지 정보를 수정합니다.
            이미지 URL이나 순서를 변경할 수 있습니다.
            """
    )
    @PutMapping("/{imageId}")
    public ResponseEntity<ProductImage> updateProductImage(
            @PathVariable("imageId") Integer imageId,
            @RequestBody ProductImageDto dto
    ) {
        ProductImage updated = productImageService.updateProductImage(imageId, dto);
        return ResponseEntity.ok(updated);
    }

    @Operation(
        summary = "상품 이미지 삭제",
        description = """
            이미지 ID(imageId)를 기준으로 해당 상품 이미지를 삭제합니다.
            삭제 성공 시 204 No Content 응답을 반환합니다.
            """
    )
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable("imageId") Integer imageId) {
        productImageService.deleteProductImage(imageId);
        return ResponseEntity.noContent().build();
    }
}