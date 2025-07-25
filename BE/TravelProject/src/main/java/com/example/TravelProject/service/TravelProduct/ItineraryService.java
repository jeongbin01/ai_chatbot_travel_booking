package com.example.TravelProject.service.TravelProduct;

import com.example.TravelProject.dto.Travelproduct.ItineraryDto;
import com.example.TravelProject.entity.Travelproduct.Itinerary;
import com.example.TravelProject.entity.Travelproduct.TravelProduct;
import com.example.TravelProject.repository.TravelProduct.ItineraryRepository;
import com.example.TravelProject.repository.TravelProduct.TravelProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItineraryService {

    private final ItineraryRepository itineraryRepository;
    private final TravelProductRepository travelProductRepository;

    /**
     * 일정(Itinerary) 생성
     */
    @Transactional
    public Itinerary createItinerary(ItineraryDto dto) {
        TravelProduct product = travelProductRepository.findById(dto.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("해당 productId 없음: " + dto.getProductId()));

        Itinerary iti = Itinerary.builder()
            .product(product)
            .dayNumber(dto.getDayNumber())
            .title(dto.getTitle())
            .description(dto.getDescription())
            .location(dto.getLocation())
            .latitude(dto.getLatitude())
            .longitude(dto.getLongitude())
            .build();

        return itineraryRepository.save(iti);
    }

    /**
     * 전체 일정 조회 (정렬 不 要 시)
     */
    public List<Itinerary> getAllItineraries() {
        return itineraryRepository.findAll();
    }

    /**
     * 단일 일정 조회
     */
    public Itinerary getItineraryById(Integer itineraryId) {
        return itineraryRepository.findById(itineraryId)
            .orElseThrow(() -> new IllegalArgumentException("해당 itineraryId 없음: " + itineraryId));
    }

    /**
     * 특정 상품의 일정 목록 조회 (dayNumber 오름차순)
     */
    public List<Itinerary> getItinerariesByProductId(Integer productId) {
        TravelProduct product = travelProductRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("해당 productId 없음: " + productId));

        // 변경된 부분: 정렬된 메서드 호출
        return itineraryRepository.findByProductOrderByDayNumberAsc(product);
    }

    /**
     * 일정 수정
     */
    @Transactional
    public Itinerary updateItinerary(Integer itineraryId, ItineraryDto dto) {
        Itinerary iti = itineraryRepository.findById(itineraryId)
            .orElseThrow(() -> new IllegalArgumentException("해당 itineraryId 없음: " + itineraryId));

        // 상품 변경이 필요하다면
        if (!iti.getProduct().getProductId().equals(dto.getProductId())) {
            TravelProduct newProduct = travelProductRepository.findById(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("해당 productId 없음: " + dto.getProductId()));
            iti.setProduct(newProduct);
        }

        iti.setDayNumber(dto.getDayNumber());
        iti.setTitle(dto.getTitle());
        iti.setDescription(dto.getDescription());
        iti.setLocation(dto.getLocation());
        iti.setLatitude(dto.getLatitude());
        iti.setLongitude(dto.getLongitude());

        return itineraryRepository.save(iti);
    }

    /**
     * 일정 삭제
     */
    @Transactional
    public void deleteItinerary(Integer itineraryId) {
        Itinerary iti = itineraryRepository.findById(itineraryId)
            .orElseThrow(() -> new IllegalArgumentException("해당 itineraryId 없음: " + itineraryId));

        itineraryRepository.delete(iti);
    }
}
