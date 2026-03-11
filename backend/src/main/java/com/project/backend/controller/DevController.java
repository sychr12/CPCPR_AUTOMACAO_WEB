package com.project.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.backend.dto.request.DevRequest;
import com.project.backend.dto.request.FiltroConsultaRequest;
import com.project.backend.dto.response.DevResponse;
import com.project.backend.dto.response.PageResponse;
import com.project.backend.service.DevService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/dev")
public class DevController {

    private final DevService service;

    public DevController(DevService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<PageResponse<DevResponse>> listar(
            @ModelAttribute FiltroConsultaRequest filtro) {

        PageResponse<DevResponse> resultado = service.buscar(filtro);
        return ResponseEntity.ok(resultado);
    }

    @PostMapping
    public ResponseEntity<DevResponse> criar(
            @Valid @RequestBody DevRequest request) {

        DevResponse response = service.criar(request);

        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<DevResponse>> criarLote(
            @RequestBody List<@Valid DevRequest> requests) {

        List<DevResponse> response = service.criarLote(requests);

        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DevResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody DevRequest request) {

        DevResponse response = service.atualizar(id, request);
        return ResponseEntity.ok(response);
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

        List<DevResponse> response = service.buscarPendentes(unloc, memorando);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/marcar-enviado")
    public ResponseEntity<Void> marcarEnviado(
            @RequestParam String unloc,
            @RequestParam String memorando) {

        service.marcarEnviado(unloc, memorando);
        return ResponseEntity.ok().build();
    }
}