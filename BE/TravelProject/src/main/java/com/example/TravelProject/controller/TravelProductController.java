package com.example.TravelProject.controller;

import com.example.TravelProject.entity.Travelproduct.TravelProduct;
import com.example.TravelProject.service.TravelProductService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/products")
@RequiredArgsConstructor
public class TravelProductController {

    private final TravelProductService travelProductService;

    @Operation(
            summary = "여행 상품 등록",
            description = """
                새로운 여행 상품(TravelProduct)을 생성합니다.
                예: 유럽 10일 패키지, 제주도 3박 4일 자유여행 등.
                """
        )
    @PostMapping
    public ResponseEntity<TravelProduct> create(@RequestBody TravelProduct product) {
        return ResponseEntity.ok(travelProductService.createProduct(product));
    }

    @Operation(
        summary = "전체 여행 상품 목록 조회",
        description = """
            등록된 모든 여행 상품을 조회합니다.
            클라이언트 메인 화면이나 상품 리스트 페이지에서 사용됩니다.
            """
    )
    @GetMapping
    public ResponseEntity<List<TravelProduct>> getAll() {
        return ResponseEntity.ok(travelProductService.getAllProducts());
    }

    @Operation(
        summary = "여행 상품 단건 조회",
        description = """
            여행 상품 ID를 기반으로 단일 상품을 조회합니다.
            상세 페이지 등에서 사용됩니다.
            """
    )
    @GetMapping("/{id}")
    public ResponseEntity<TravelProduct> getById(@PathVariable("id") Integer id) {
        return travelProductService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
        summary = "여행 상품 수정",
        description = """
            여행 상품 ID에 해당하는 데이터를 수정합니다.
            상품명, 설명, 가격 등을 변경할 수 있습니다.
            """
    )
    @PutMapping("/{id}")
    public ResponseEntity<TravelProduct> update(@PathVariable("id") Integer id, @RequestBody TravelProduct product) {
        return ResponseEntity.ok(travelProductService.updateProduct(id, product));
    }

    @Operation(
        summary = "여행 상품 삭제",
        description = """
            여행 상품 ID를 기반으로 해당 상품을 삭제합니다.
            연관된 일정, 이미지, 포함 서비스 등이 존재할 경우 주의가 필요합니다.
            """
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        travelProductService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}