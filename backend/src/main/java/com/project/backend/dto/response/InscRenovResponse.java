package com.project.backend.dto.response;

import java.time.LocalDateTime;

public class InscRenovResponse {
    private Long id;
    private String nome;
    private String cpf;
    private String unloc;
    private String memorando;
    private String datas;
    private String descricao;
    private String analise;
    private String lancou;
    private LocalDateTime datalan;
    private Boolean urgente;

    public InscRenovResponse() {}

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
    public String getDatas() { return datas; }
    public void setDatas(String datas) { this.datas = datas; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getAnalise() { return analise; }
    public void setAnalise(String analise) { this.analise = analise; }
    public String getLancou() { return lancou; }
    public void setLancou(String lancou) { this.lancou = lancou; }
    public LocalDateTime getDatalan() { return datalan; }
    public void setDatalan(LocalDateTime datalan) { this.datalan = datalan; }
    public Boolean getUrgente() { return urgente; }
    public void setUrgente(Boolean urgente) { this.urgente = urgente; }
}