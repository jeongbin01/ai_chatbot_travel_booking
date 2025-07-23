//package com.example.TravelProject.service.Room;
//
//import com.example.TravelProject.entity.room.AccommodationAmenity;
//import com.example.TravelProject.repository.Room.AccommodationAmenityRepository;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class AccommodationAmentyService {
//
//    private final AccommodationAmenityRepository accommodationAmenityRepository;
//
//    // 숙소 ID로 등록된 편의시설 리스트 조회
//    public List<AccommodationAmenity> findByAccommodationId(Integer accommodationId) {
//        return accommodationAmenityRepository.findByAccommodation_AccommodationId(accommodationId);
//    }
//
//    // 숙소에 편의시설 등록 (중복 체크는 컨트롤러 또는 비즈니스 로직에서 선처리)
//    public AccommodationAmenity save(AccommodationAmenity amenity) {
//        return accommodationAmenityRepository.save(amenity);
//    }
//
//    // 숙소에 연결된 특정 편의시설 삭제
//    public void deleteByAccommodationIdAndAmenityId(Integer accommodationId, Integer amenityId) {
//        accommodationAmenityRepository.deleteByAccommodation_AccommodationIdAndAmenity_AmenityId(accommodationId, amenityId);
//    }
//
//
//    // 숙소에 특정 편의시설이 이미 등록되었는지 확인
//    public boolean existsByAccommodationIdAndAmenityId(Integer accommodationId, Integer amenityId) {
//        return accommodationAmenityRepository.existsByAccommodation_AccommodationIdAndAmenity_AmenityId(accommodationId, amenityId);
//    }
//}
