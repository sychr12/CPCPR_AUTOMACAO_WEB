package com.project.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.selenium.AutomacaoResult;
import com.project.backend.selenium.SefaService;
import com.project.backend.selenium.SigedService;

/**
 * Controller REST para disparar automações Selenium.
 * Todas as rotas ficam em /api/automacao/...
 */
@RestController
@RequestMapping("/automacao")
public class AutomacaoController {

    private final SigedService sigedService;
    private final SefaService  sefaService;

    public AutomacaoController(SigedService sigedService, SefaService sefaService) {
        this.sigedService = sigedService;
        this.sefaService  = sefaService;
    }

    /**
     * POST /api/automacao/siged/anexar
     * Body: { "numeroProcesso": "2024/001", "caminhoArquivo": "C:/docs/arquivo.pdf" }
     */
    @PostMapping("/siged/anexar")
    public ResponseEntity<AutomacaoResult> anexarSiged(
            @RequestBody AnexarRequest request) {

        AutomacaoResult result = sigedService.anexarDocumento(
            request.getNumeroProcesso(),
            request.getCaminhoArquivo()
        );

        if (result.isSucesso()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(500).body(result);
        }
    }

    /**
     * POST /api/automacao/sefa/anexar
     * Body: { "cpf": "123.456.789-00", "caminhoArquivo": "C:/docs/arquivo.pdf" }
     */
    @PostMapping("/sefa/anexar")
    public ResponseEntity<AutomacaoResult> anexarSefa(
            @RequestBody AnexarRequest request) {

        AutomacaoResult result = sefaService.anexarDocumento(
            request.getCpf(),
            request.getCaminhoArquivo()
        );

        if (result.isSucesso()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(500).body(result);
        }
    }

    // ── DTO interno ───────────────────────────────────────────────
    public static class AnexarRequest {
        private String numeroProcesso;
        private String cpf;
        private String caminhoArquivo;

        public String getNumeroProcesso()  { return numeroProcesso; }
        public void setNumeroProcesso(String v) { this.numeroProcesso = v; }
        public String getCpf()             { return cpf; }
        public void setCpf(String v)       { this.cpf = v; }
        public String getCaminhoArquivo()  { return caminhoArquivo; }
        public void setCaminhoArquivo(String v) { this.caminhoArquivo = v; }
    }
}