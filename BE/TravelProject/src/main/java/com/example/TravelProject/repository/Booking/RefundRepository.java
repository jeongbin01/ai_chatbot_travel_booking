package com.example.TravelProject.repository.Booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Booking.Refund;



@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    // 필요한 메서드 여기에 
}
