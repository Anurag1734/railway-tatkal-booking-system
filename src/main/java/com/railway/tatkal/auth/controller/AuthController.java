package com.railway.tatkal.auth.controller;

import com.railway.tatkal.auth.dto.LoginRequest;
import com.railway.tatkal.auth.dto.RegisterRequest;
import com.railway.tatkal.auth.service.AuthService;
import com.railway.tatkal.user.entity.User;
import com.railway.tatkal.auth.dto.LoginRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        User user = authService.register(request);

        RegisterResponse response = new RegisterResponse(
                user.getId(),
                "Registration successful"
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    public record RegisterResponse(
            Long userId,
            String message
    ) {
    }

        @PostMapping("/login")
        public ResponseEntity<LoginResponse> login(
                @Valid @RequestBody LoginRequest request
        ) {
        AuthService.LoginResult result = authService.login(request);

        LoginResponse response = new LoginResponse(
                result.userId(),
                result.accessToken(),
                "Bearer"
        );

        return ResponseEntity.ok(response);
        }

        public record LoginResponse(
                Long userId,
                String accessToken,
                String tokenType
        ) {
        }

}