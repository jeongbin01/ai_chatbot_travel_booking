package com.example.TravelProject.repository.Room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Room.Accommodation;

import java.util.List;

@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation, Integer> {

    // ownerId(유저 ID)로 숙소 목록 조회
    List<Accommodation> findByOwner_UserId(Integer userId);

    // 숙소 이름으로 검색 (부분 일치)
    List<Accommodation> findByNameContaining(String keyword);

    // 숙소 활성화 여부로 조회
    List<Accommodation> findByIsActive(boolean isActive);
}
