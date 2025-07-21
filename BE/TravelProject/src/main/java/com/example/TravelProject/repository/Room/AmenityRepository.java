package com.example.TravelProject.repository.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.room.Amenity;

import java.util.Optional;
import java.util.List;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Integer> {

    // 이름으로 편의시설 검색 
    Optional<Amenity> findByName(String name);

    // 이름으로 편의시설 검색 
    List<Amenity> findByNameContaining(String keyword);

    // 아이콘 URL이 null이 아닌 편의시설만 조회
    List<Amenity> findByIconUrlIsNotNull();
}
