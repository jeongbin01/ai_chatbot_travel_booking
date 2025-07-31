package com.example.TravelProject.service.Room;

import com.example.TravelProject.entity.room.Accommodation;
import com.example.TravelProject.repository.Room.AccommodationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;

    // 모든 숙소 조회
    public List<Accommodation> findAll() {
        return accommodationRepository.findAll();
    }

    // 숙소 ID로 단건 조회
    public Optional<Accommodation> findById(Integer id) {
        return accommodationRepository.findById(id);
    }

    // 숙소 저장 (등록 또는 수정)
    public Accommodation save(Accommodation accommodation) {
        return accommodationRepository.save(accommodation);
    }

    // 숙소 삭제
    public void deleteById(Integer id) {
        accommodationRepository.deleteById(id);
    }

    // 특정 유저 ID로 등록한 숙소 목록 조회
    public List<Accommodation> findByOwnerUserId(Integer userId) {
        return accommodationRepository.findByOwner_UserId(userId);
    }

    // 숙소 이름으로 검색 (부분 일치)
    public List<Accommodation> searchByName(String keyword) {
        return accommodationRepository.findByNameContaining(keyword);
    }

    // ✅ is_domestic = 'Y' or 'N' 필터로 숙소 조회
    public List<Accommodation> findByIsDomestic(String isDomestic) {
        return accommodationRepository.findByIsDomestic(isDomestic);
    }
}
