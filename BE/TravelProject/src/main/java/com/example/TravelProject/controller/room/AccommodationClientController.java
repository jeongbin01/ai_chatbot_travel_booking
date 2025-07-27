//package com.example.TravelProject.controller.room;
//
//import com.example.TravelProject.dto.Room.AccommodationDTO;
//import com.example.TravelProject.dto.accommodation.AccommodationListDTO;
//import com.example.TravelProject.entity.room.Accommodation;
//import com.example.TravelProject.service.accommodation.AccommodationListService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.List;
//@RestController
//@RequestMapping("/app/accommodations")
//@RequiredArgsConstructor
//public class AccommodationClientController {
//    AccommodationListService accommodationListService;
//    @GetMapping
//    public List<AccommodationListDTO> getAllAccommodations() {
//        return accommodationListService.findAll().stream()
//                .map(acc -> AccommodationListDTO.builder()
//                        .id(acc.getAccommodationId())
//                        .name(acc.getName())
//                        .location(acc.getAddress())
//                        .price(0) // 아직 PricePolicy 조인 안 했으니 임시
//                        .capacity(0) // RoomType 조인 안 했으니 임시
//                        .rating(acc.getRatingAvg() != null ? acc.getRatingAvg().doubleValue() : 0.0)
//                        .liked(false) // 기본 false
//                        .image("") // 이미지 추후 매핑
//                        .build())
//                .collect(Collectors.toList());
//
//    }
//}
