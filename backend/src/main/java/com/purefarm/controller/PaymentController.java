package com.purefarm.controller;

import com.purefarm.dto.PaymentRequest;
import com.purefarm.model.Payment;
import com.purefarm.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /** Step 8: customer clicks "I HAVE PAID" and submits UTR / transaction id. */
    @PostMapping
    public Payment submitPayment(@Valid @RequestBody PaymentRequest request) {
        return paymentService.submitPayment(request);
    }
}
