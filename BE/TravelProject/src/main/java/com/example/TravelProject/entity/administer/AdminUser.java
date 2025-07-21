package com.example.TravelProject.entity.administer;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin_user")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer adminId;

    @Column(nullable = false, unique = true)
    private String username;  // 로그인 ID

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, unique = true)
    private String email;

    private String role;  // 슈퍼관리자, 상품관리자, CS관리자
}

