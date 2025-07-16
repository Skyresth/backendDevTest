package com.example.yourApp.service;

import com.example.yourApp.dto.ProductDetailDTO;
import com.example.yourApp.model.ProductDetail;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final WebClient productApiWebClient;

    public ProductService(WebClient.Builder webClientBuilder) {
        // Spring injects a WebClient.Builder; here we customize and build one instance
        this.productApiWebClient = webClientBuilder
                .baseUrl("http://localhost:3001")
                .build();
    }

    public List<ProductDetailDTO> getSimilarProducts(String productId) {
        // 1. fetch IDs
        String[] similarIds = productApiWebClient.get()
                .uri("/product/{productId}/similarids", productId)
                .retrieve()
                .bodyToMono(String[].class)
                .block();

        List<ProductDetailDTO> result = new ArrayList<>();
        if (similarIds != null) {
            for (String id : similarIds) {
                ProductDetail pd = productApiWebClient.get()
                        .uri("/product/{id}", id)
                        .retrieve()
                        .bodyToMono(ProductDetail.class)
                        .block();

                if (pd != null) {
                    result.add(new ProductDetailDTO(
                            pd.getId(),
                            pd.getName(),
                            pd.getPrice(),
                            pd.isAvailability()
                    ));
                }
            }
        }
        return result;
    }
}