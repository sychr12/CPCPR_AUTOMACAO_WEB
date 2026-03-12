package com.project.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.dto.request.LoginRequest;
import com.project.backend.dto.request.TrocarSenhaRequest;
import com.project.backend.dto.response.LoginResponse;
import com.project.backend.service.AuthService;

@RestController
@RequestMapping("/auth")  // ← era /api/auth
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/trocar-senha")
    public ResponseEntity<Void> trocarSenha(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody TrocarSenhaRequest request) {
        if (user == null) return ResponseEntity.status(401).build();
        authService.trocarSenha(user.getUsername(), request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> me(@AuthenticationPrincipal UserDetails user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(Map.of(
            "nome", user.getUsername(),
            "perfil", user.getAuthorities().iterator().next().getAuthority()
        ));
    }
}