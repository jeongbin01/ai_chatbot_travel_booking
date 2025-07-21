package com.example.TravelProject.entity.useraccount;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, unique = true)
    private String email;

    private String phoneNumber;

    private String nickname;

    private String profileImageUrl;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime registrationDate = LocalDateTime.now();

    private LocalDateTime lastLoginDate;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true;

    @Column
    private String userRole; // 사용자 역할 (예: 일반 사용자, 사업자, 관리자)
}
