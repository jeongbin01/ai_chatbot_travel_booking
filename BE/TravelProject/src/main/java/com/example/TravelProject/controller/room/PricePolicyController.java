package com.example.TravelProject.controller.room;

import com.example.TravelProject.entity.room.PricePolicy;
import com.example.TravelProject.service.Room.PricePolicyService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/app/price-policies") // URL prefix
@RequiredArgsConstructor
public class PricePolicyController {

    private final PricePolicyService pricePolicyService;
    
    @Operation(
            summary = "모든 가격 정책 조회",
            description = """
                전체 객실/숙소에 설정된 가격 정책 리스트를 조회합니다.
                일반적으로 관리자 화면, 객실 목록 구성 시 사용됩니다.
                """
        )
    @GetMapping
    public List<PricePolicy> getAllPricePolicies() {
        return pricePolicyService.findAll();
    }

    @Operation(
        summary = "가격 정책 단건 조회",
        description = """
            고유 ID를 기반으로 특정 가격 정책 정보를 조회합니다.
            존재하지 않을 경우 Optional.empty()를 반환합니다.
            """
    )
    @GetMapping("/{id}")
    public Optional<PricePolicy> getPricePolicyById(@PathVariable Integer id) {
        return pricePolicyService.findById(id);
    }

    @Operation(
        summary = "가격 정책 등록/수정",
        description = """
            전달받은 가격 정책 정보를 저장합니다.
            ID가 없으면 신규 등록, 존재하면 해당 ID에 대한 정책이 수정됩니다.
            """
    )
    @PostMapping
    public PricePolicy createPricePolicy(@RequestBody PricePolicy pricePolicy) {
        return pricePolicyService.save(pricePolicy);
    }

    @Operation(
        summary = "가격 정책 삭제",
        description = """
            가격 정책 ID를 기준으로 해당 정책을 삭제합니다.
            정책 삭제 시 관련된 숙소 가격 표시에도 영향을 줄 수 있습니다.
            """
    )
    @DeleteMapping("/{id}")
    public void deletePricePolicy(@PathVariable Integer id) {
        pricePolicyService.deleteById(id);
    }
}