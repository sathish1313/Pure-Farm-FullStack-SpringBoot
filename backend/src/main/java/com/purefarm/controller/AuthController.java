package com.purefarm.controller;

import com.purefarm.dto.AuthRequest;
import com.purefarm.model.User;
import com.purefarm.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody AuthRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public User login(@RequestBody AuthRequest request) {
        return authService.login(request);
    }
}
