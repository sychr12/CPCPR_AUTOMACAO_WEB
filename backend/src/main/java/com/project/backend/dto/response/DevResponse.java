package com.project.backend.dto.response;

import java.time.LocalDate;

public class DevResponse {
    private Long id;
    private String nome;
    private String cpf;
    private String unloc;
    private String memorando;
    private String motivo;
    private LocalDate envio;
    private String analise;

    public DevResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getUnloc() { return unloc; }
    public void setUnloc(String unloc) { this.unloc = unloc; }
    public String getMemorandum() { return memorando; }
    public void setMemorandum(String m) { this.memorando = m; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public LocalDate getEnvio() { return envio; }
    public void setEnvio(LocalDate envio) { this.envio = envio; }
    public String getAnalise() { return analise; }
    public void setAnalise(String analise) { this.analise = analise; }
}