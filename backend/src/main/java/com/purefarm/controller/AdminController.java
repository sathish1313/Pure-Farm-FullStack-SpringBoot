package com.purefarm.controller;

import com.purefarm.dto.OrderStatusUpdateRequest;
import com.purefarm.dto.PaymentVerifyRequest;
import com.purefarm.model.*;
import com.purefarm.service.OrderService;
import com.purefarm.service.PaymentService;
import com.purefarm.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * NOTE: In production, secure everything under /api/admin/** with Spring Security
 * (role-based auth / JWT) so only ADMIN users can reach these endpoints.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final PaymentService paymentService;

    // ---------- Dashboard ----------

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        List<Orders> allOrders = orderService.getAllOrders();
        long pendingPayments = allOrders.stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.VERIFICATION_PENDING)
                .count();
        BigDecimal totalSales = allOrders.stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.PAID)
                .map(Orders::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long lowStock = productService.getAllForAdmin().stream()
                .filter(p -> p.getStock() != null && p.getStock() < 5)
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", allOrders.size());
        stats.put("pendingPayments", pendingPayments);
        stats.put("totalProducts", productService.getAllForAdmin().size());
        stats.put("lowStock", lowStock);
        stats.put("totalSales", totalSales);
        return stats;
    }

    // ---------- Orders ----------

    @GetMapping("/orders")
    public List<Orders> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/orders/{orderCode}/status")
    public Orders updateOrderStatus(@PathVariable String orderCode, @RequestBody OrderStatusUpdateRequest request) {
        return orderService.updateStatus(orderCode, request.getStatus());
    }

    // ---------- Payments ----------

    @PutMapping("/payments/{paymentId}/verify")
    public Orders verifyPayment(@PathVariable Long paymentId, @RequestBody PaymentVerifyRequest request) {
        return paymentService.verifyPayment(paymentId, request.isApprove());
    }

    // ---------- Products ----------

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productService.getAllForAdmin();
    }

    @PostMapping("/products")
    public Product createProduct(@RequestBody Product product) {
        return productService.create(product);
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return productService.update(id, product);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.delete(id);
    }
}
