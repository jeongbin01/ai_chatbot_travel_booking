package com.example.TravelProject.entity.ChatBot;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_message")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer messageId;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private ChatSession session;

    private String sender;  // '사용자' or '봇'

    @Column(columnDefinition = "TEXT", nullable = false)
    private String messageText;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    private Boolean isSuccessfulResponse;

    private String intentDetected;
}