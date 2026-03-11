package com.project.backend.dto.request;

import jakarta.validation.constraints.Pattern;

public class InscRenovRequest {
    private String nome;
    private String cpf;
    private String unloc;
    private String memorando;
    private String datas;

    @Pattern(regexp = "INSC|RENOV")
    private String descricao;

    private String analise;
    private Boolean urgente;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getUnloc() { return unloc; }
    public void setUnloc(String unloc) { this.unloc = unloc; }
    public String getMemorandum() { return memorando; }
    public void setMemorandum(String memorando) { this.memorando = memorando; }
    public String getDatas() { return datas; }
    public void setDatas(String datas) { this.datas = datas; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getAnalise() { return analise; }
    public void setAnalise(String analise) { this.analise = analise; }
    public Boolean getUrgente() { return urgente; }
    public void setUrgente(Boolean urgente) { this.urgente = urgente; }
}