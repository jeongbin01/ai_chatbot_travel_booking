package com.example.TravelProject.entity.administer;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.example.TravelProject.entity.useraccount.User;

@Entity
@Table(name = "log")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer logId;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    private String eventType;  // 로그인, 상품 등록, 예약 생성 등

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String affectedEntityType;

    private Integer affectedEntityId;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String ipAddress;
}
