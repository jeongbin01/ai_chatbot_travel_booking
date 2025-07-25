package com.example.TravelProject.entity.Travelproduct;

import java.io.Serializable;
import java.util.Objects;

public class IncludedServiceId implements Serializable {

    private Long product;     // TravelProduct의 PK 타입과 동일하게
    private Long travelService;  // Service의 PK 타입과 동일하게

    public IncludedServiceId() {}

    public IncludedServiceId(Long product, Long travelService) {
        this.product = product;
        this.travelService = travelService;
    }

    // equals와 hashCode 반드시 구현
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof IncludedServiceId)) return false;
        IncludedServiceId that = (IncludedServiceId) o;
        return Objects.equals(product, that.product) &&
                Objects.equals(travelService, that.travelService);
    }

    @Override
    public int hashCode() {
        return Objects.hash(product, travelService);
    }

    // getter, setter (필요시)
}

