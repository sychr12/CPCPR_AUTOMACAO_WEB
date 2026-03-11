package com.project.backend.controller;

import com.project.backend.dto.request.FiltroConsultaRequest;
import com.project.backend.dto.request.InscRenovRequest;
import com.project.backend.dto.response.InscRenovResponse;
import com.project.backend.dto.response.PageResponse;
import com.project.backend.service.InscRenovService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscrenov")
public class InscRenovController {

    private final InscRenovService service;

    public InscRenovController(InscRenovService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PageResponse<InscRenovResponse>> listar(
            @ModelAttribute FiltroConsultaRequest filtro) {
        return ResponseEntity.ok(service.buscar(filtro));
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<List<InscRenovResponse>> buscarPorCpf(@PathVariable String cpf) {
        return ResponseEntity.ok(service.buscarPorCpf(cpf));
    }

    @PostMapping
    public ResponseEntity<InscRenovResponse> criar(
            @Valid @RequestBody InscRenovRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(201)
                .body(service.criar(request, user.getUsername()));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<InscRenovResponse>> criarLote(
            @RequestBody List<@Valid InscRenovRequest> requests,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(201)
                .body(service.criarLote(requests, user.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InscRenovResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody InscRenovRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/lancar")
    public ResponseEntity<InscRenovResponse> lancar(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(service.lancar(id, user.getUsername()));
    }
}