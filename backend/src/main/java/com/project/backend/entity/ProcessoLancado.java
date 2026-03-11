package com.project.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "processos_lancados")
public class ProcessoLancado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String arquivo;
    private String lancou;
    private LocalDateTime dataLancamento;
    private String cpf;

    public ProcessoLancado() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getArquivo() { return arquivo; }
    public void setArquivo(String arquivo) { this.arquivo = arquivo; }
    public String getLancou() { return lancou; }
    public void setLancou(String lancou) { this.lancou = lancou; }
    public LocalDateTime getDataLancamento() { return dataLancamento; }
    public void setDataLancamento(LocalDateTime dataLancamento) { this.dataLancamento = dataLancamento; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
}