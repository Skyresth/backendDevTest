package com.example.yourApp.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@JsonAutoDetect(fieldVisibility = Visibility.ANY)
public class ProductDetailDTO {
    private String id;
    private String name;
    private BigDecimal price;
    private boolean availability;

    public ProductDetailDTO(String id,
                            String name,
                            BigDecimal price,
                            boolean availability) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.availability = availability;
    }

}
