package com.purefarm.dto;

import lombok.Data;

@Data
public class PaymentVerifyRequest {
    private boolean approve; // true = CONFIRM PAYMENT, false = REJECT PAYMENT
}
