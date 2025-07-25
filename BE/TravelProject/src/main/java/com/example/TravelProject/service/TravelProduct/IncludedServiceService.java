package com.example.TravelProject.service.TravelProduct;

import com.example.TravelProject.dto.Travelproduct.IncludedServiceDto;
import com.example.TravelProject.entity.Travelproduct.IncludedService;

import com.example.TravelProject.entity.Travelproduct.Service;
import com.example.TravelProject.entity.Travelproduct.TravelProduct;
import com.example.TravelProject.repository.TravelProduct.IncludedServiceRepository;
import com.example.TravelProject.repository.TravelProduct.ServiceRepository;
import com.example.TravelProject.repository.TravelProduct.TravelProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;

// 어노테이션은 풀 네임스페이스로 지정
@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class IncludedServiceService {

    private final IncludedServiceRepository includedServiceRepository;
    private final TravelProductRepository travelProductRepository;
    private final ServiceRepository serviceRepository;

    /**
     * IncludedService 생성
     */
    @Transactional
    public IncludedService createIncludedService(IncludedServiceDto dto) {
        TravelProduct product = travelProductRepository.findById(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("해당 productId 없음: " + dto.getProductId()));

        Service travelService = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new IllegalArgumentException("해당 serviceId 없음: " + dto.getServiceId()));

        includedServiceRepository.findByProductAndTravelService(product, travelService)
                .ifPresent(existing -> {
                    throw new IllegalStateException("이미 존재하는 IncludedService 입니다.");
                });

        IncludedService includedService = IncludedService.builder()
                .product(product)
                .travelService(travelService)
                .build();

        return includedServiceRepository.save(includedService);
    }

    /**
     * 전체 IncludedService 목록 조회
     */
    public List<IncludedService> getAllIncludedServices() {
        return includedServiceRepository.findAll();
    }

    /**
     * 특정 상품에 포함된 서비스 조회
     */
    public List<IncludedService> getIncludedServicesByProductId(Integer productId) {
        TravelProduct product = travelProductRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("해당 productId 없음: " + productId));

        return includedServiceRepository.findByProduct(product);
    }

    /**
     * 특정 조합 IncludedService 삭제
     */
    @Transactional
    public void deleteIncludedService(Integer productId, Integer serviceId) {
        TravelProduct product = travelProductRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("해당 productId 없음: " + productId));

        Service travelService = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new IllegalArgumentException("해당 serviceId 없음: " + serviceId));

        IncludedService includedService = includedServiceRepository.findByProductAndTravelService(product, travelService)
                .orElseThrow(() -> new IllegalArgumentException("해당 IncludedService 없음."));

        includedServiceRepository.delete(includedService);
    }
}
