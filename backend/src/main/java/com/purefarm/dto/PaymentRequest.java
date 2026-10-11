package com.purefarm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotBlank(message = "Order code is required")
    private String orderCode;

    @NotBlank(message = "UTR / Transaction ID is required")
    private String utrNumber;

    private String screenshotUrl;
}
