package com.project.backend.dto.response;

public class LoginResponse {
    private String token;
    private String nome;
    private String perfil;

    public LoginResponse() {}
    public LoginResponse(String token, String nome, String perfil) {
        this.token = token;
        this.nome = nome;
        this.perfil = perfil;
    }

    public String getToken() { return token; }
    public String getNome() { return nome; }
    public String getPerfil() { return perfil; }
}