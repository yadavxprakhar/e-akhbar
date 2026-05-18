package com.news.controller;

import com.news.dto.JwtAuthResponse;
import com.news.dto.LoginRequest;
import com.news.dto.SignUpRequest;
import com.news.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Endpoint for user account registration
     */
    @PostMapping("/register")
    public ResponseEntity<JwtAuthResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        JwtAuthResponse response = userService.registerUser(signUpRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for user authentication
     */
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthResponse response = userService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint for refreshing expired short-term access tokens
     */
    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthResponse> refreshAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is missing");
        }
        JwtAuthResponse response = userService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(response);
    }
}
