package com.purefarm.service;

import com.purefarm.dto.OrderItemRequest;
import com.purefarm.dto.OrderRequest;
import com.purefarm.model.*;
import com.purefarm.repository.OrderRepository;
import com.purefarm.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;

    // Simple in-memory running counter appended to timestamp for uniqueness.
    // For production, back this with a DB sequence table.
    private static final AtomicLong SEQUENCE = new AtomicLong(1000);

    @Transactional
    public Orders createOrder(OrderRequest request) {
        Orders order = new Orders();
        order.setOrderCode(generateOrderCode());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setAddress(request.getAddress());
        order.setCity(request.getCity());
        order.setPincode(request.getPincode());
        order.setOrderStatus(OrderStatus.PAYMENT_PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            if (product.getStock() < itemReq.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + product.getName());
            }

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(product.getPrice());
            order.getItems().add(item);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
        }

        order.setTotalAmount(total);
        Orders saved = orderRepository.save(order);
        return saved;
    }

    /** Called only after payment is confirmed by admin - decrements stock. */
    @Transactional
    public void reduceStockForOrder(Orders order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }
    }

    public Orders getByOrderCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderCode));
    }

    public List<Orders> getOrdersByPhone(String phone) {
        return orderRepository.findByCustomerPhoneOrderByCreatedAtDesc(phone);
    }

    public List<Orders> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Orders updateStatus(String orderCode, OrderStatus newStatus) {
        Orders order = getByOrderCode(orderCode);
        order.setOrderStatus(newStatus);
        Orders saved = orderRepository.save(order);
        notificationService.notifyOrderStatusChange(saved);
        return saved;
    }

    private String generateOrderCode() {
        return "ORD" + SEQUENCE.incrementAndGet();
    }
}
