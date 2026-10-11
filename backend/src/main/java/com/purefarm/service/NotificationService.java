package com.purefarm.service;

import com.purefarm.model.Orders;
import com.purefarm.model.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Handles email notifications for Pure Farm.
 *
 * Email notifications are controlled by:
 * app.notifications.email.enabled
 */
@Service
@Slf4j
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${app.notifications.email.enabled:false}")
    private boolean emailEnabled;

    /**
     * Gmail address configured in application.properties.
     * This address is used as the sender and admin notification recipient.
     */
    @Value("${spring.mail.username:}")
    private String fromAddress;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends email to customer when an order is created.
     */
    public void notifyOrderCreated(Orders order) {

        send(
                recipientOf(order),
                "Order Received - " + order.getOrderCode(),

                "Hi " + order.getCustomerName() + ",\n\n"
                        + "Your order " + order.getOrderCode()
                        + " for Rs. " + order.getTotalAmount()
                        + " has been created.\n\n"
                        + "Please complete the UPI payment.\n\n"
                        + "Thank you,\n"
                        + "Pure Farm Products");
    }

    /**
     * Gets customer's email address.
     */
    private String recipientOf(Orders order) {

        return order.getUser() != null
                ? order.getUser().getEmail()
                : null;
    }

    /**
     * Sends email to admin when customer submits payment/UTR.
     */
    public void notifyAdminNewPayment(Orders order) {

        log.info(
                "New payment submitted for verification: {} | Amount: {}",
                order.getOrderCode(),
                order.getTotalAmount());

        Payment payment = order.getPayment();

        String utr = "Not provided";

        if (payment != null && payment.getUtrNumber() != null) {
            utr = payment.getUtrNumber();
        }

        String customerEmail = recipientOf(order);

        String body = "New payment has been submitted for verification.\n\n"

                + "ORDER DETAILS\n"
                + "-------------------------\n"
                + "Order Number: " + order.getOrderCode() + "\n"
                + "Customer Name: " + order.getCustomerName() + "\n"
                + "Customer Email: " + customerEmail + "\n"
                + "Amount: Rs. " + order.getTotalAmount() + "\n\n"

                + "PAYMENT DETAILS\n"
                + "-------------------------\n"
                + "UTR Number: " + utr + "\n"
                + "Payment Status: " + order.getPaymentStatus() + "\n\n"

                + "Please verify this payment in the Pure Farm admin panel.\n\n"

                + "Pure Farm Products";

        // Send payment notification to admin Gmail.
        send(
                fromAddress,
                "New Payment Received - " + order.getOrderCode(),
                body);
    }

    /**
     * Sends email to customer when payment is confirmed.
     */
    public void notifyPaymentConfirmed(Orders order) {

        send(
                recipientOf(order),
                "Payment Confirmed - " + order.getOrderCode(),

                "Hi " + order.getCustomerName() + ",\n\n"
                        + "Your payment for order "
                        + order.getOrderCode()
                        + " has been confirmed.\n\n"
                        + "Amount Paid: Rs. "
                        + order.getTotalAmount()
                        + "\n\n"
                        + "Thank you for shopping with Pure Farm Products!\n\n"
                        + "Pure Farm Products");
    }

    /**
     * Sends email to customer when order status changes.
     */
    public void notifyOrderStatusChange(Orders order) {

        send(
                recipientOf(order),
                "Order Update - " + order.getOrderCode(),

                "Hi " + order.getCustomerName() + ",\n\n"
                        + "Your order "
                        + order.getOrderCode()
                        + " status is now:\n\n"
                        + order.getOrderStatus()
                        + "\n\n"
                        + "Thank you,\n"
                        + "Pure Farm Products");
    }

    /**
     * Common email sending method.
     */
    private void send(String to, String subject, String body) {

        // Email notifications disabled.
        if (!emailEnabled) {

            log.info(
                    "[EMAIL DISABLED] to={} | subject={}",
                    to,
                    subject);

            return;
        }

        // Recipient doesn't exist.
        if (to == null || to.isBlank()) {

            log.warn(
                    "[EMAIL SKIPPED] No recipient address | subject={}",
                    subject);

            return;
        }

        // Gmail username isn't configured.
        if (fromAddress == null || fromAddress.isBlank()) {

            log.error(
                    "[EMAIL FAILED] spring.mail.username is not configured");

            return;
        }

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            log.info(
                    "[EMAIL SENT] to={} | subject={}",
                    to,
                    subject);

        } catch (Exception e) {

            log.error(
                    "[EMAIL FAILED] to={} | subject={} | error={}",
                    to,
                    subject,
                    e.getMessage(),
                    e);
        }
    }
}