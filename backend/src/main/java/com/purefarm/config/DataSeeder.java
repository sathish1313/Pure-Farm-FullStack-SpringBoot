package com.purefarm.config;

import com.purefarm.model.Product;
import com.purefarm.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return;

        Product coconutOil = new Product();
        coconutOil.setName("Coconut Oil");
        coconutOil.setDescription("Cold-pressed pure coconut oil, farm extracted.");
        coconutOil.setPrice(new BigDecimal("250"));
        coconutOil.setUnit("1 Litre");
        coconutOil.setStock(25);
        coconutOil.setImageUrl("/images/coconut-oil.jpg");
        productRepository.save(coconutOil);

        Product groundnutOil = new Product();
        groundnutOil.setName("Groundnut Oil");
        groundnutOil.setDescription("Traditionally extracted groundnut (peanut) oil.");
        groundnutOil.setPrice(new BigDecimal("180"));
        groundnutOil.setUnit("1 Litre");
        groundnutOil.setStock(30);
        groundnutOil.setImageUrl("/images/groundnut-oil.jpg");
        productRepository.save(groundnutOil);

        Product rice = new Product();
        rice.setName("Rice");
        rice.setDescription("Farm-grown quality rice.");
        rice.setPrice(new BigDecimal("600"));
        rice.setUnit("5 kg");
        rice.setStock(15);
        rice.setImageUrl("/images/rice.jpg");
        productRepository.save(rice);
    }
}
