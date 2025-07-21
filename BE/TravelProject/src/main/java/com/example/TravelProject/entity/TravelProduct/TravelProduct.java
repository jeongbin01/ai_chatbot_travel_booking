package com.example.TravelProject.entity.TravelProduct;
import com.example.TravelProject.entity.UserAccount.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "travel_product")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TravelProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @ManyToOne
    @JoinColumn(name = "owner_user_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    @Column(nullable = false)
    private String destination;

    private Integer durationDays;
    private Integer durationNights;

    @Column(columnDefinition = "TEXT")
    private String inclusion;

    @Column(columnDefinition = "TEXT")
    private String exclusion;

    @Column(nullable = false)
    private BigDecimal basePrice;
    @Builder.Default
    @Column(nullable = false)
    private Integer minParticipants = 1;

    private Integer maxParticipants;
    @Builder.Default
    private String currency = "KRW";
    @Builder.Default
    private Boolean isActive = true;
    @Builder.Default
    private LocalDateTime registrationDate = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime lastUpdatedDate = LocalDateTime.now();
}


