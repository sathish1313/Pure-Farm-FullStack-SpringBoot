package com.purefarm.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    @NotBlank(message = "Name is required")
    private String customerName;

    @NotBlank(message = "Mobile number is required")
    private String customerPhone;

    @NotBlank(message = "Address is required")
    private String address;

    private String city;
    private String pincode;

    @NotEmpty(message = "Cart cannot be empty")
    private List<@Valid OrderItemRequest> items;
}
