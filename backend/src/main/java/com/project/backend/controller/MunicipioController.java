package com.project.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.service.MunicipioService;

@RestController
@RequestMapping("/municipios")  // ← era /api/municipios
public class MunicipioController {

    private final MunicipioService service;

    public MunicipioController(MunicipioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> buscar(
            @RequestParam(value = "q", required = false) String q) {
        return ResponseEntity.ok(service.buscar(q));
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Map<String, String>>> todos() {
        return ResponseEntity.ok(service.getTodos());
    }
}