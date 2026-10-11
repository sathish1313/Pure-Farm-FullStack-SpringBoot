package com.purefarm.service;

import com.purefarm.dto.PaymentRequest;
import com.purefarm.model.*;
import com.purefarm.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderService orderService;
    private final NotificationService notificationService;

    @Value("${app.upi.id}")
    private String upiId;

    @Value("${app.upi.payeeName}")
    private String payeeName;

    /**
     * Builds a standard UPI deep-link string.
     * The frontend renders this as a QR code.
     */
    public String buildUpiLink(Orders order) {

        String note = URLEncoder.encode(
                "Order " + order.getOrderCode(),
                StandardCharsets.UTF_8);

        String name = URLEncoder.encode(
                payeeName,
                StandardCharsets.UTF_8);

        return "upi://pay?pa=" + upiId
                + "&pn=" + name
                + "&am=" + order.getTotalAmount().toPlainString()
                + "&cu=INR"
                + "&tn=" + note;
    }

    /**
     * Customer clicks "I HAVE PAID"
     * and submits UTR / transaction id.
     */
    @Transactional
    public Payment submitPayment(PaymentRequest request) {

        System.out.println("======================================");
        System.out.println("       PAYMENT SUBMISSION STARTED     ");
        System.out.println("======================================");

        System.out.println("Order Code: " + request.getOrderCode());
        System.out.println("UTR Number: " + request.getUtrNumber());
        System.out.println("Screenshot: " + request.getScreenshotUrl());

        // Find the order
        Orders order = orderService.getByOrderCode(
                request.getOrderCode());

        System.out.println("Order found: " + order.getOrderCode());
        System.out.println("Customer: " + order.getCustomerName());
        System.out.println("Amount: Rs. " + order.getTotalAmount());

        // Get existing payment if available
        Payment payment = order.getPayment();

        if (payment == null) {

            System.out.println("Creating new payment record...");

            payment = new Payment();
            payment.setOrder(order);

        } else {

            System.out.println("Existing payment record found.");
        }

        // Set payment details
        payment.setAmount(order.getTotalAmount());

        payment.setUtrNumber(
                request.getUtrNumber());

        payment.setScreenshotUrl(
                request.getScreenshotUrl());

        payment.setPaymentStatus(
                PaymentStatus.VERIFICATION_PENDING);

        payment.setSubmittedAt(
                LocalDateTime.now());

        // Update order
        order.setPayment(payment);

        order.setPaymentStatus(
                PaymentStatus.VERIFICATION_PENDING);

        // Save payment
        Payment saved = paymentRepository.save(payment);

        System.out.println("======================================");
        System.out.println("       PAYMENT SAVED SUCCESSFULLY     ");
        System.out.println("======================================");

        System.out.println("Payment ID: " + saved.getId());
        System.out.println("Order: " + order.getOrderCode());
        System.out.println("UTR: " + saved.getUtrNumber());
        System.out.println("Amount: Rs. " + saved.getAmount());
        System.out.println("Status: " + saved.getPaymentStatus());

        // Send admin email notification
        System.out.println("======================================");
        System.out.println("      CALLING EMAIL NOTIFICATION      ");
        System.out.println("======================================");

        notificationService.notifyAdminNewPayment(order);

        System.out.println("======================================");
        System.out.println("       PAYMENT SUBMISSION COMPLETE    ");
        System.out.println("======================================");

        return saved;
    }

    /**
     * Admin clicks CONFIRM PAYMENT or REJECT PAYMENT.
     */
    @Transactional
    public Orders verifyPayment(
            Long paymentId,
            boolean approve) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Payment not found: " + paymentId));

        Orders order = payment.getOrder();

        if (approve) {

            payment.setPaymentStatus(
                    PaymentStatus.PAID);

            order.setPaymentStatus(
                    PaymentStatus.PAID);

            order.setOrderStatus(
                    OrderStatus.CONFIRMED);

            // Reduce product stock
            orderService.reduceStockForOrder(order);

            // Send payment confirmation email to customer
            notificationService.notifyPaymentConfirmed(order);

        } else {

            payment.setPaymentStatus(
                    PaymentStatus.REJECTED);

            order.setPaymentStatus(
                    PaymentStatus.REJECTED);
        }

        payment.setVerifiedAt(
                LocalDateTime.now());

        paymentRepository.save(payment);

        return order;
    }
}