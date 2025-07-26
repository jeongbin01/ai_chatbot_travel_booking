//package com.example.TravelProject.service.TravelProduct;
//
//import com.example.TravelProject.entity.Travelproduct.TravelProduct;
//import com.example.TravelProject.entity.useraccount.User;
//import com.example.TravelProject.repository.TravelProduct.TravelProductRepository;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class TravelProductService {
//
//    private final TravelProductRepository travelProductRepository;
//
//    /**
//     * 새 여행 상품 등록
//     */
//    @Transactional
//    public TravelProduct createProduct(TravelProduct product) {
//        product.setRegistrationDate(LocalDateTime.now());
//        product.setLastUpdatedDate(LocalDateTime.now());
//        return travelProductRepository.save(product);
//    }
//
//    /**
//     * 모든 여행 상품 조회
//     */
//    public List<TravelProduct> getAllProducts() {
//        return travelProductRepository.findAll();
//    }
//
//    /**
//     * ID로 단일 여행 상품 조회
//     */
//    public TravelProduct getProductById(Integer productId) {
//        return travelProductRepository.findById(productId)
//            .orElseThrow(() -> new IllegalArgumentException("해당 productId 없음: " + productId));
//    }
//
//    /**
//     * 특정 사용자 소유 상품 조회
//     */
//    public List<TravelProduct> getProductsByOwner(User owner) {
//        return travelProductRepository.findByOwner(owner);
//    }
//
//    /**
//     * 여행 상품 수정
//     */
//    @Transactional
//    public TravelProduct updateProduct(Integer productId, TravelProduct dto) {
//        TravelProduct existing = travelProductRepository.findById(productId)
//            .orElseThrow(() -> new IllegalArgumentException("해당 productId 없음: " + productId));
//
//        existing.setName(dto.getName());
//        existing.setDescription(dto.getDescription());
//        existing.setCategory(dto.getCategory());
//        existing.setDestination(dto.getDestination());
//        existing.setDurationDays(dto.getDurationDays());
//        existing.setDurationNights(dto.getDurationNights());
//        existing.setInclusion(dto.getInclusion());
//        existing.setExclusion(dto.getExclusion());
//        existing.setBasePrice(dto.getBasePrice());
//        existing.setMinParticipants(dto.getMinParticipants());
//        existing.setMaxParticipants(dto.getMaxParticipants());
//        existing.setCurrency(dto.getCurrency());
//        existing.setIsActive(dto.getIsActive());
//        existing.setLastUpdatedDate(LocalDateTime.now());
//
//        return travelProductRepository.save(existing);
//    }
//
//    /**
//     * 여행 상품 삭제
//     */
//    @Transactional
//    public void deleteProduct(Integer productId) {
//        TravelProduct existing = getProductById(productId);
//        travelProductRepository.delete(existing);
//    }
//}
