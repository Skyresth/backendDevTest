package com.example.yourApp.controller;

import com.example.yourApp.dto.ProductDetailDTO;
import com.example.yourApp.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @Operation(summary = "Get products",
            description = "Return list of similar products given an ID")
    @GetMapping("/{productId}/similar")
    public ResponseEntity<List<ProductDetailDTO>> getSimilarProducts(@PathVariable String productId) {
        List<ProductDetailDTO> list = productService.getSimilarProducts(productId);
        if (list.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(list);
    }
}
