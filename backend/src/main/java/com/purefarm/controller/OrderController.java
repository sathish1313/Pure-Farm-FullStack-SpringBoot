package com.purefarm.controller;

import com.purefarm.dto.OrderRequest;
import com.purefarm.model.Orders;
import com.purefarm.service.NotificationService;
import com.purefarm.service.OrderService;
import com.purefarm.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;
    private final NotificationService notificationService;

    /** Step 6: create the order, still PAYMENT_PENDING. */
    @PostMapping
    public Orders createOrder(@Valid @RequestBody OrderRequest request) {
        Orders order = orderService.createOrder(request);
        notificationService.notifyOrderCreated(order);
        return order;
    }

    /** Step 7: fetch the order + a ready-to-render UPI QR link. */
    @GetMapping("/{orderCode}")
    public Map<String, Object> getOrder(@PathVariable String orderCode) {
        Orders order = orderService.getByOrderCode(orderCode);
        Map<String, Object> response = new HashMap<>();
        response.put("order", order);
        response.put("upiLink", paymentService.buildUpiLink(order));
        return response;
    }

    /** "My Orders" lookup by phone number (no login required). */
    @GetMapping("/by-phone/{phone}")
    public List<Orders> getOrdersByPhone(@PathVariable String phone) {
        return orderService.getOrdersByPhone(phone);
    }
}
