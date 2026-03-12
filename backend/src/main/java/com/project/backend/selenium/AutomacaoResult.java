package com.project.backend.selenium;

/**
 * Resultado padronizado retornado por todas as automações Selenium.
 */
public class AutomacaoResult {

    private boolean sucesso;
    private String mensagem;
    private String detalhe;

    public AutomacaoResult() {}

    public static AutomacaoResult ok(String mensagem) {
        AutomacaoResult r = new AutomacaoResult();
        r.sucesso  = true;
        r.mensagem = mensagem;
        return r;
    }

    public static AutomacaoResult erro(String mensagem, String detalhe) {
        AutomacaoResult r = new AutomacaoResult();
        r.sucesso  = false;
        r.mensagem = mensagem;
        r.detalhe  = detalhe;
        return r;
    }

    public boolean isSucesso()    { return sucesso; }
    public String getMensagem()   { return mensagem; }
    public String getDetalhe()    { return detalhe; }
}