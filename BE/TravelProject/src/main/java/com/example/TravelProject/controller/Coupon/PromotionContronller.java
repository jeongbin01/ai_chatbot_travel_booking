package com.example.TravelProject.controller.Coupon;

import com.example.TravelProject.entity.Coupon.Promotion;
import com.example.TravelProject.service.Coupon.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionContronller {

    private final PromotionService promotionService;

    // 전체 프로모션 목록 조회
    @GetMapping
    public List<Promotion> getAllPromotions() {
        return promotionService.getAllPromotions();
    }

    // ID로 프로모션 조회
    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable Integer id) {
        return promotionService.getPromotionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 프로모션 등록
    @PostMapping
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        Promotion saved = promotionService.savePromotion(promotion);
        return ResponseEntity.ok(saved);
    }


    // 프로모션 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Integer id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }
}
