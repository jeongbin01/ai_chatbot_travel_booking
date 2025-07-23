//package com.example.TravelProject.service.Room;
//
//import com.example.TravelProject.entity.room.Amenity;
//import com.example.TravelProject.repository.Room.AmenityRepository;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class AmenityService {
//
//    private final AmenityRepository amenityRepository;
//
//    // 모든 편의시설 조회
//    public List<Amenity> findAll() {
//        return amenityRepository.findAll();
//    }
//
//    // ID로 편의시설 조회
//    public Optional<Amenity> findById(Integer id) {
//        return amenityRepository.findById(id);
//    }
//
//    // 편의시설 저장 (등록 또는 수정)
//    public Amenity save(Amenity amenity) {
//        return amenityRepository.save(amenity);
//    }
//
//    // ID로 편의시설 삭제
//    public void deleteById(Integer id) {
//        amenityRepository.deleteById(id);
//    }
//
//    // 이름으로 편의시설 단건 조회 (정확 일치)
//    public Optional<Amenity> findByName(String name) {
//        return amenityRepository.findByName(name);
//    }
//
//    // 이름에 키워드가 포함된 편의시설 검색
//    public List<Amenity> searchByName(String keyword) {
//        return amenityRepository.findByNameContaining(keyword);
//    }
//
//
//    // 아이콘이 등록된 편의시설만 조회
//    public List<Amenity> findWithIcons() {
//        return amenityRepository.findByIconUrlIsNotNull();
//    }
//}
