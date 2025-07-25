package com.example.TravelProject.service.TravelProduct;

import com.example.TravelProject.dto.Travelproduct.ProductImageDto;
import com.example.TravelProject.entity.Travelproduct.ProductImage;
import com.example.TravelProject.entity.Travelproduct.TravelProduct;
import com.example.TravelProject.repository.TravelProduct.ProductImageRepository;
import com.example.TravelProject.repository.TravelProduct.TravelProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final TravelProductRepository travelProductRepository;

    /**
     * ProductImage 생성
     */
    @Transactional
    public ProductImage createProductImage(ProductImageDto dto) {
        TravelProduct product = travelProductRepository.findById(dto.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("해당 productId 없음: " + dto.getProductId()));

        ProductImage img = ProductImage.builder()
            .product(product)
            .imageUrl(dto.getImageUrl())
            .caption(dto.getCaption())
            .orderNum(dto.getOrderNum())
            .build();

        return productImageRepository.save(img);
    }

    /**
     * 전체 ProductImage 조회
     */
    public List<ProductImage> getAllProductImages() {
        return productImageRepository.findAll();
    }

    /**
     * 단일 ProductImage 조회
     */
    public ProductImage getProductImageById(Integer imageId) {
        return productImageRepository.findById(imageId)
            .orElseThrow(() -> new IllegalArgumentException("해당 imageId 없음: " + imageId));
    }

    /**
     * 특정 상품의 이미지 목록 조회 (orderNum 오름차순)
     */
    public List<ProductImage> getProductImagesByProductId(Integer productId) {
        TravelProduct product = travelProductRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("해당 productId 없음: " + productId));

        return productImageRepository.findByProductOrderByOrderNumAsc(product);
    }

    /**
     * ProductImage 수정
     */
    @Transactional
    public ProductImage updateProductImage(Integer imageId, ProductImageDto dto) {
        ProductImage img = getProductImageById(imageId);

        if (!img.getProduct().getProductId().equals(dto.getProductId())) {
            TravelProduct newProduct = travelProductRepository.findById(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("해당 productId 없음: " + dto.getProductId()));
            img.setProduct(newProduct);
        }

        img.setImageUrl(dto.getImageUrl());
        img.setCaption(dto.getCaption());
        img.setOrderNum(dto.getOrderNum());

        return productImageRepository.save(img);
    }

    /**
     * ProductImage 삭제
     */
    @Transactional
    public void deleteProductImage(Integer imageId) {
        ProductImage img = getProductImageById(imageId);
        productImageRepository.delete(img);
    }
}
