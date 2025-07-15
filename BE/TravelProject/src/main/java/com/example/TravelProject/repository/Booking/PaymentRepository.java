package com.example.TravelProject.repository.Booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.Booking.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>{
	
}