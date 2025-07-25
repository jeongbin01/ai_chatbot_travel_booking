package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.PricePolicy;
import com.example.TravelProject.service.Room.PricePolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/price-policies") // URL prefix
@RequiredArgsConstructor
public class PricePolicyController {

    private final PricePolicyService pricePolicyService;

    // 모든 가격 정책 조회
    @GetMapping
    public List<PricePolicy> getAllPricePolicies() {
        return pricePolicyService.findAll();
    }

    // 특정 가격 정책 조회
    @GetMapping("/{id}")
    public Optional<PricePolicy> getPricePolicyById(@PathVariable Integer id) {
        return pricePolicyService.findById(id);
    }

    // 가격 정책 저장
    @PostMapping
    public PricePolicy createPricePolicy(@RequestBody PricePolicy pricePolicy) {
        return pricePolicyService.save(pricePolicy);
    }

    // 가격 정책 삭제
    @DeleteMapping("/{id}")
    public void deletePricePolicy(@PathVariable Integer id) {
        pricePolicyService.deleteById(id);
    }
}
