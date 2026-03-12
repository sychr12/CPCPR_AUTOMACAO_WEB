package com.project.backend.service;

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
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByNome(request.getNome())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!request.getSenha().equals(usuario.getSenha())) {
            throw new RuntimeException("Senha incorreta");
        }

        if (Boolean.FALSE.equals(usuario.getAtivo())) {
            throw new RuntimeException("Usuário inativo");
        }

        String token = jwtService.generateToken(usuario.getNome());
        return new LoginResponse(token, usuario.getNome(), usuario.getPerfil());
    }

    public void trocarSenha(String nomeUsuario, TrocarSenhaRequest request) {
        Usuario usuario = usuarioRepository.findByNome(nomeUsuario)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        if (!request.getSenhaAtual().equals(usuario.getSenha())) {
            throw new RuntimeException("Senha atual incorreta");
        }
        usuario.setSenha(request.getNovaSenha());
        usuarioRepository.save(usuario);
    }
}