package com.example.TravelProject.entity.UserAccount;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "socialaccount")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer social_account_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 연결된 사용자 (외래키)

    @Column(nullable = false)
    private String provider;

    private String access_token;

    private String refresh_token;

    private LocalDateTime last_synced_date;
}
