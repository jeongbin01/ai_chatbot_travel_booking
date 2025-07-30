package com.example.TravelProject.dto.login;

import com.example.TravelProject.entity.useraccount.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MyUserDTO {
    private Integer userId;
    private String email;
    private String phoneNumber;
    private LocalDateTime registrationDate;
    private String userRole;
    private String nickname;
    private String username;

    public static MyUserDTO fromEntity(User user) {
        MyUserDTO dto = new MyUserDTO();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRegistrationDate(user.getRegistrationDate());
        dto.setUserRole(user.getUserRole());
        dto.setNickname(user.getNickname());
        dto.setUsername(user.getUsername());
        return dto;
    }
}
