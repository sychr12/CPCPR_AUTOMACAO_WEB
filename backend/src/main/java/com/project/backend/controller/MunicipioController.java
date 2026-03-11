package com.project.backend.controller;

import com.project.backend.service.MunicipioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/municipios")
public class MunicipioController {

    private final MunicipioService service;

    public MunicipioController(MunicipioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> buscar(
            @RequestParam(value = "q", required = false) String q) {

        List<Map<String, String>> municipios = service.buscar(q);
        return ResponseEntity.ok(municipios);
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Map<String, String>>> todos() {

        List<Map<String, String>> municipios = service.getTodos();
        return ResponseEntity.ok(municipios);
    }
}