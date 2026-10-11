package com.purefarm.repository;

import com.purefarm.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Orders, Long> {
    Optional<Orders> findByOrderCode(String orderCode);
    List<Orders> findByCustomerPhoneOrderByCreatedAtDesc(String phone);
    List<Orders> findAllByOrderByCreatedAtDesc();
}
