//package com.example.TravelProject.service.Coupon;
//
//import com.example.TravelProject.entity.coupon.Promotion;
//import com.example.TravelProject.repository.Coupon.PromotionRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//public class PromotionService {
//
//    private final PromotionRepository promotionRepository;
//
//    // 전체 프로모션 목록 조회
//    public List<Promotion> getAllPromotions() {
//        return promotionRepository.findAll();
//    }
//
//    // ID로 단건 조회
//    public Optional<Promotion> getPromotionById(Integer promotionId) {
//        return promotionRepository.findById(promotionId);
//    }
//
//    // 저장 (등록 또는 수정)
//    public Promotion savePromotion(Promotion promotion) {
//        return promotionRepository.save(promotion);
//    }
//
//    // 삭제
//    public void deletePromotion(Integer promotionId) {
//        promotionRepository.deleteById(promotionId);
//    }
//
//    // 상태로 조회 ("활성", "비활성")
//    public List<Promotion> getPromotionsByStatus(String status) {
//        return promotionRepository.findByStatus(status);
//    }
//}
