package com.example.TravelProject.dto.Booking;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.TravelProject.entity.booking.Booking;
import com.example.TravelProject.entity.useraccount.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingGuestDTO {
	
	private Integer guestId;
	
	private Booking booking;
	
	private String fistName;
	
    private LocalDate dateOfBirth;	
    
    private String gender;
    
    private String contactPhone;
    
    private String contactEmail;
}