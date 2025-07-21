package com.example.TravelProject.entity.chatbot;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.example.TravelProject.entity.useraccount.User;

@Entity
@Table(name = "chat_session")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sessionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;  // nullable 허용됨
    @Builder.Default
    private LocalDateTime startTime = LocalDateTime.now();
    private LocalDateTime endTime;
    @Builder.Default
    private LocalDateTime lastInteractionTime = LocalDateTime.now();

    private String purpose;  // '숙소 추천', '여행 상품 문의', '예약 변경' 등
}
