package com.example.TravelProject.dto.login;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
//@AllArgsConstructor
@Builder
public class MyPageDTO {
    private Integer userId;
    private String email;
    private String phoneNumber;
    private LocalDateTime registrationDate;
    private String userRole;
    private String nickname;
    private String username;
    private Integer socialAccountId;
    private String provider;

    // JPQL에서 사용하는 명시적 생성자
    public MyPageDTO(Integer userId, String email, String phoneNumber,
                     LocalDateTime registrationDate, String userRole, String nickname,
                     String username, Integer socialAccountId, String provider) {
        this.userId = userId;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.registrationDate = registrationDate;
        this.userRole = userRole;
        this.nickname = nickname;
        this.username = username;
        this.socialAccountId = socialAccountId;
        this.provider = provider;
    }
}
