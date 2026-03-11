package com.project.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.backend.dto.request.LoginRequest;
import com.project.backend.dto.request.TrocarSenhaRequest;
import com.project.backend.dto.response.LoginResponse;
import com.project.backend.entity.Usuario;
import com.project.backend.repository.UsuarioRepository;
import com.project.backend.security.JwtService;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authManager) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
    }

    public LoginResponse login(LoginRequest request) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getNome(), request.getSenha())
        );
        Usuario usuario = usuarioRepository.findByNome(request.getNome())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        String token = jwtService.generateToken(usuario.getNome());
        return new LoginResponse(token, usuario.getNome(), usuario.getPerfil());
    }

    public void trocarSenha(String nomeUsuario, TrocarSenhaRequest request) {
        Usuario usuario = usuarioRepository.findByNome(nomeUsuario)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        if (!passwordEncoder.matches(request.getSenhaAtual(), usuario.getSenha())) {
            throw new RuntimeException("Senha atual incorreta");
        }
        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        usuarioRepository.save(usuario);
    }
}