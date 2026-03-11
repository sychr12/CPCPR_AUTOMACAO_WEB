package com.project.backend.dto.request;

public class FiltroConsultaRequest {
    private String nome;
    private String cpf;
    private String unloc;
    private String memorando;
    private String descricao;
    private String lancou;
    private int page = 0;
    private int size = 20;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getUnloc() { return unloc; }
    public void setUnloc(String unloc) { this.unloc = unloc; }
    public String getMemorandum() { return memorando; }
    public void setMemorandum(String memorando) { this.memorando = memorando; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getLancou() { return lancou; }
    public void setLancou(String lancou) { this.lancou = lancou; }
    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }
    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }
}