package com.purefarm.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    @Column(nullable = false)
    private String password; // NOTE: hash this with BCrypt before production use

    @Enumerated(EnumType.STRING)
    private Role role = Role.CUSTOMER;

    public enum Role {
        CUSTOMER, ADMIN
    }
}
