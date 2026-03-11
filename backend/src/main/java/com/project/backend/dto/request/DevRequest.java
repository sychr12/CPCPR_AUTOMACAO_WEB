package com.project.backend.dto.request;

public class DevRequest {
    private String nome;
    private String cpf;
    private String unloc;
    private String memorando;
    private String motivo;
    private String analise;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getUnloc() { return unloc; }
    public void setUnloc(String unloc) { this.unloc = unloc; }
    public String getMemorandum() { return memorando; }
    public void setMemorandum(String memorando) { this.memorando = memorando; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public String getAnalise() { return analise; }
    public void setAnalise(String analise) { this.analise = analise; }
}