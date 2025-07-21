package com.example.TravelProject.service.Room;

import com.example.TravelProject.entity.room.AccommodationImage;
import com.example.TravelProject.repository.Room.AccommodationImageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AccommodationImageService {

    private final AccommodationImageRepository accommodationImageRepository;

    // 숙소 ID로 모든 이미지 조회 (orderNum 순으로 정렬)
    public List<AccommodationImage> findImagesByAccommodationId(Integer accommodationId) {
        return accommodationImageRepository.findByAccommodation_AccommodationIdOrderByOrderNumAsc(accommodationId);
    }

    // 숙소 이미지 저장
    public AccommodationImage saveImage(AccommodationImage image) {
        return accommodationImageRepository.save(image);
    }

    // 숙소의 모든 이미지 삭제
    public void deleteAllByAccommodationId(Integer accommodationId) {
        accommodationImageRepository.deleteByAccommodation_AccommodationId(accommodationId);
    }
    
    //특정 이미지 ID로 삭제
    public void deleteById(Integer imageId) {
        accommodationImageRepository.deleteById(imageId);
    }

    // 숙소의 대표 이미지 조회 (orderNum == 0)
    public AccommodationImage findThumbnail(Integer accommodationId) {
        return accommodationImageRepository.findFirstByAccommodation_AccommodationIdAndOrderNum(accommodationId, 0);
    }

    // 이미지 ID 단건 숙소 이미지 조회
    public Optional<AccommodationImage> findById1(Integer imageId) {
        return accommodationImageRepository.findById(imageId);
    }

}
