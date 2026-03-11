package com.project.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "inscrenov")
public class InscRenov {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    private Boolean urgente = false;

    public InscRenov() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getUnloc() { return unloc; }
    public void setUnloc(String unloc) { this.unloc = unloc; }
    public String getMemorandum() { return memorando; }
    public void setMemorandum(String memorando) { this.memorando = memorando; }
    public String getMemorandum2() { return memorando; }
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