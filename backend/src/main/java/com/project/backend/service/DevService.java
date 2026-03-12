package com.project.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.project.backend.dto.request.DevRequest;
import com.project.backend.dto.request.FiltroConsultaRequest;
import com.project.backend.dto.response.DevResponse;
import com.project.backend.dto.response.PageResponse;
import com.project.backend.entity.Dev;
import com.project.backend.repository.DevRepository;

@Service
public class DevService {

    private final DevRepository repository;

    public DevService(DevRepository repository) {
        this.repository = repository;
    }

    public DevResponse criar(DevRequest request) {
        Dev e = new Dev();
        e.setNome(request.getNome());
        e.setCpf(request.getCpf());
        e.setUnloc(request.getUnloc());
        e.setMemorandum(request.getMemorandum());
        e.setMotivo(request.getMotivo());
        e.setAnalise(request.getAnalise());
        return toResponse(repository.save(e));
    }

    public List<DevResponse> criarLote(List<DevRequest> requests) {
        return requests.stream()
                .map(this::criar)
                .collect(Collectors.toList());
    }

    public DevResponse atualizar(Long id, DevRequest request) {
        Dev e = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));
        e.setNome(request.getNome());
        e.setCpf(request.getCpf());
        e.setUnloc(request.getUnloc());
        e.setMemorandum(request.getMemorandum());
        e.setMotivo(request.getMotivo());
        e.setAnalise(request.getAnalise());
        return toResponse(repository.save(e));
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public PageResponse<DevResponse> buscar(FiltroConsultaRequest filtro) {
        PageRequest pageable = PageRequest.of(
                filtro.getPage() < 0 ? 0 : filtro.getPage(),
                filtro.getSize() <= 0 ? 20 : filtro.getSize()
        );
        Page<Dev> page = repository.buscarComFiltros(
                filtro.getNome(), filtro.getCpf(),
                filtro.getUnloc(), filtro.getMemorandum(),
                pageable
        );
        List<DevResponse> content = page.getContent().stream()
                .map(this::toResponse).collect(Collectors.toList());
        return new PageResponse<>(content, page.getTotalPages(),
                page.getTotalElements(), page.getNumber(), page.getSize());
    }

    public List<DevResponse> buscarPendentes(String unloc, String memorando) {
        return repository.findByUnlocAndMemorandoAndEnvioIsNull(unloc, memorando)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public void marcarEnviado(String unloc, String memorando) {
        List<Dev> pendentes = repository.findByUnlocAndMemorandoAndEnvioIsNull(unloc, memorando);
        pendentes.forEach(d -> d.setEnvio(LocalDate.now()));
        repository.saveAll(pendentes);
    }

    private DevResponse toResponse(Dev e) {
        DevResponse r = new DevResponse();
        r.setId(e.getId());
        r.setNome(e.getNome());
        r.setCpf(e.getCpf());
        r.setUnloc(e.getUnloc());
        r.setMemorandum(e.getMemorandum());
        r.setMotivo(e.getMotivo());
        r.setEnvio(e.getEnvio());
        r.setAnalise(e.getAnalise());
        return r;
    }
}