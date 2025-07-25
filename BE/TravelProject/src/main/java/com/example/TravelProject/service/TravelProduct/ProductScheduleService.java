// src/main/java/com/example/TravelProject/service/TravelProduct/ProductScheduleService.java
package com.example.TravelProject.service.TravelProduct;

import com.example.TravelProject.dto.Travelproduct.ProductScheduleDto;
import com.example.TravelProject.entity.Travelproduct.ProductSchedule;
import com.example.TravelProject.entity.Travelproduct.TravelProduct;
import com.example.TravelProject.repository.TravelProduct.ProductScheduleRepository;
import com.example.TravelProject.repository.TravelProduct.TravelProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ProductScheduleService {

    private final ProductScheduleRepository scheduleRepository;
    private final TravelProductRepository travelProductRepository;

    /** 새 스케줄 생성 */
    @Transactional
    public ProductSchedule createProductSchedule(ProductScheduleDto dto) {
        TravelProduct product = travelProductRepository.findById(dto.getProductId())
            .orElseThrow(() -> new ResponseStatusException(
                NOT_FOUND, "해당 productId 없음: " + dto.getProductId()
            ));

        ProductSchedule schedule = ProductSchedule.builder()
            .product(product)
            .departureDate(dto.getDepartureDate())
            .returnDate(dto.getReturnDate())
            .currentPrice(dto.getCurrentPrice())
            .availableSlots(dto.getAvailableSlots())
            .status(dto.getStatus())
            .build();

        return scheduleRepository.save(schedule);
    }

    /** 전체 스케줄 조회 */
    public List<ProductSchedule> getAllProductSchedules() {
        return scheduleRepository.findAll();
    }

    /** ID로 단일 스케줄 조회 */
    public ProductSchedule getProductScheduleById(Integer scheduleId) {
        return scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new ResponseStatusException(
                NOT_FOUND, "해당 scheduleId 없음: " + scheduleId
            ));
    }

    /** 상품별 스케줄 조회 (출발일 오름차순) */
    public List<ProductSchedule> getSchedulesByProductId(Integer productId) {
        TravelProduct product = travelProductRepository.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(
                NOT_FOUND, "해당 productId 없음: " + productId
            ));
        return scheduleRepository.findByProductOrderByDepartureDateAsc(product);
    }

    /** 오늘 이후 출발하는 스케줄만 조회 */
    public List<ProductSchedule> getUpcomingSchedules() {
        return scheduleRepository.findByDepartureDateAfter(LocalDate.now());
    }

    /** 스케줄 업데이트 */
    @Transactional
    public ProductSchedule updateProductSchedule(Integer scheduleId, ProductScheduleDto dto) {
        ProductSchedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new ResponseStatusException(
                NOT_FOUND, "해당 scheduleId 없음: " + scheduleId
            ));

        if (!schedule.getProduct().getProductId().equals(dto.getProductId())) {
            TravelProduct newProduct = travelProductRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResponseStatusException(
                    NOT_FOUND, "해당 productId 없음: " + dto.getProductId()
                ));
            schedule.setProduct(newProduct);
        }

        schedule.setDepartureDate(dto.getDepartureDate());
        schedule.setReturnDate(dto.getReturnDate());
        schedule.setCurrentPrice(dto.getCurrentPrice());
        schedule.setAvailableSlots(dto.getAvailableSlots());
        schedule.setStatus(dto.getStatus());

        return scheduleRepository.save(schedule);
    }

    /** 스케줄 삭제 */
    @Transactional
    public void deleteProductSchedule(Integer scheduleId) {
        ProductSchedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new ResponseStatusException(
                NOT_FOUND, "해당 scheduleId 없음: " + scheduleId
            ));
        scheduleRepository.delete(schedule);
    }
}
