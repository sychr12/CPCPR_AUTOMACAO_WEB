package com.project.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.dto.request.FiltroConsultaRequest;
import com.project.backend.service.DevService;
import com.project.backend.service.InscRenovService;

@RestController
@RequestMapping("/dashboard")  // ← era /api/dashboard
public class DashboardController {

    private final InscRenovService inscRenovService;
    private final DevService devService;

    public DashboardController(InscRenovService inscRenovService, DevService devService) {
        this.inscRenovService = inscRenovService;
        this.devService = devService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        long totalInsc  = inscRenovService.buscar(filtro("INSC")).getTotalElements();
        long totalRenov = inscRenovService.buscar(filtro("RENOV")).getTotalElements();
        long totalDev   = devService.buscar(filtro(null)).getTotalElements();

        return ResponseEntity.ok(Map.of(
            "totalInscricoes", totalInsc,
            "totalRenovacoes", totalRenov,
            "totalDevolucoes", totalDev,
            "total", totalInsc + totalRenov
        ));
    }

    private FiltroConsultaRequest filtro(String descricao) {
        FiltroConsultaRequest f = new FiltroConsultaRequest();
        f.setDescricao(descricao);
        f.setSize(1);
        return f;
    }
}