package com.example.TravelProject.entity.room;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "price_policy")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PricePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "price_policy_id")
    private Integer pricePolicyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "base_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal basePrice;

    @Builder.Default
    @Column(name = "additional_person_surcharge", precision = 10, scale = 2)
    private BigDecimal additionalPersonSurcharge = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "weekend_surcharge", precision = 10, scale = 2)
    private BigDecimal weekendSurcharge = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "holiday_surcharge", precision = 10, scale = 2)
    private BigDecimal holidaySurcharge = BigDecimal.ZERO;
}
