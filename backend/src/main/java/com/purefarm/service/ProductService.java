package com.purefarm.service;

import com.purefarm.model.Product;
import com.purefarm.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllActiveProducts() {
        return productRepository.findAll().stream()
                .filter(p -> Boolean.TRUE.equals(p.getActive()))
                .toList();
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    public Product create(Product product) {
        return productRepository.save(product);
    }

    public Product update(Long id, Product updated) {
        Product existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setUnit(updated.getUnit());
        existing.setStock(updated.getStock());
        existing.setImageUrl(updated.getImageUrl());
        existing.setActive(updated.getActive());
        return productRepository.save(existing);
    }

    public void delete(Long id) {
        Product p = getById(id);
        p.setActive(false); // soft delete keeps order history intact
        productRepository.save(p);
    }

    public List<Product> getAllForAdmin() {
        return productRepository.findAll();
    }
}
