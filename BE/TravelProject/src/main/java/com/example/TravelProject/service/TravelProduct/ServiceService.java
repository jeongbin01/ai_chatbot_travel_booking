package com.example.TravelProject.service.TravelProduct;

import com.example.TravelProject.dto.Travelproduct.ServiceResponseDTO;
import com.example.TravelProject.entity.Travelproduct.Service;
import com.example.TravelProject.repository.TravelProduct.ServiceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    /**
     * 새 Service 생성
     */
    @Transactional
    public ServiceResponseDTO createService(ServiceResponseDTO dto) {
        Service entity = Service.builder()               // assuming @Builder on entity
                .name(dto.getName())
                .description(dto.getDescription())
                .build();

        Service saved = serviceRepository.save(entity);
        return toDto(saved);
    }

    /**
     * 모든 Service 조회
     */
    public List<ServiceResponseDTO> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * ID로 단일 Service 조회
     */
    public ServiceResponseDTO getServiceById(Integer serviceId) {
        Service entity = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new IllegalArgumentException("해당 serviceId 없음: " + serviceId));
        return toDto(entity);
    }

    /**
     * Service 업데이트
     */
    @Transactional
    public ServiceResponseDTO updateService(Integer serviceId, ServiceResponseDTO dto) {
        Service entity = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new IllegalArgumentException("해당 serviceId 없음: " + serviceId));

        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());

        Service updated = serviceRepository.save(entity);
        return toDto(updated);
    }

    /**
     * Service 삭제
     */
    @Transactional
    public void deleteService(Integer serviceId) {
        Service entity = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new IllegalArgumentException("해당 serviceId 없음: " + serviceId));
        serviceRepository.delete(entity);
    }

    /** Entity → DTO 변환 헬퍼 */
    private ServiceResponseDTO toDto(Service s) {
        return new ServiceResponseDTO(
            s.getServiceId(),
            s.getName(),
            s.getDescription()
        );
    }
}
