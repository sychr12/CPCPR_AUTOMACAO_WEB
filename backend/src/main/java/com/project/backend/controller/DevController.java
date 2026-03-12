package com.project.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.dto.request.DevRequest;
import com.project.backend.dto.request.FiltroConsultaRequest;
import com.project.backend.dto.response.DevResponse;
import com.project.backend.dto.response.PageResponse;
import com.project.backend.service.DevService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/dev")  // ← era /api/dev
public class DevController {

    private final DevService service;

    public DevController(DevService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PageResponse<DevResponse>> listar(
            @ModelAttribute FiltroConsultaRequest filtro) {
        return ResponseEntity.ok(service.buscar(filtro));
    }

    @PostMapping
    public ResponseEntity<DevResponse> criar(
            @Valid @RequestBody DevRequest request) {
        return ResponseEntity.status(201).body(service.criar(request));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<DevResponse>> criarLote(
            @RequestBody List<@Valid DevRequest> requests) {
        return ResponseEntity.status(201).body(service.criarLote(requests));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DevResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody DevRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<DevResponse>> pendentes(
            @RequestParam String unloc,
            @RequestParam String memorando) {
        return ResponseEntity.ok(service.buscarPendentes(unloc, memorando));
    }

    @PatchMapping("/marcar-enviado")
    public ResponseEntity<Void> marcarEnviado(
            @RequestParam String unloc,
            @RequestParam String memorando) {
        service.marcarEnviado(unloc, memorando);
        return ResponseEntity.ok().build();
    }
}