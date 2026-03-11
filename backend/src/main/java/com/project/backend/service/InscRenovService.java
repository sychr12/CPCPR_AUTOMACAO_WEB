package com.project.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.project.backend.dto.request.FiltroConsultaRequest;
import com.project.backend.dto.request.InscRenovRequest;
import com.project.backend.dto.response.InscRenovResponse;
import com.project.backend.dto.response.PageResponse;
import com.project.backend.entity.InscRenov;
import com.project.backend.repository.InscRenovRepository;

@Service
public class InscRenovService {

    private final InscRenovRepository repository;

    public InscRenovService(InscRenovRepository repository) {
        this.repository = repository;
    }

    public InscRenovResponse criar(InscRenovRequest request, String username) {
        InscRenov e = new InscRenov();
        e.setNome(request.getNome());
        e.setCpf(request.getCpf());
        e.setUnloc(request.getUnloc());
        e.setMemorandum(request.getMemorandum());
        e.setDatas(request.getDatas());
        e.setDescricao(request.getDescricao());
        e.setAnalise(request.getAnalise());
        e.setUrgente(Boolean.TRUE.equals(request.getUrgente()));
        return toResponse(repository.save(e));
    }

    public List<InscRenovResponse> criarLote(List<InscRenovRequest> requests, String username) {
        return requests.stream()
                .map(r -> criar(r, username))
                .collect(Collectors.toList());
    }

    public InscRenovResponse atualizar(Long id, InscRenovRequest request) {
        InscRenov e = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));
        e.setNome(request.getNome());
        e.setCpf(request.getCpf());
        e.setUnloc(request.getUnloc());
        e.setMemorandum(request.getMemorandum());
        e.setDatas(request.getDatas());
        e.setDescricao(request.getDescricao());
        e.setAnalise(request.getAnalise());
        e.setUrgente(Boolean.TRUE.equals(request.getUrgente())); // ← corrigido
        return toResponse(repository.save(e));
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public InscRenovResponse lancar(Long id, String nomeUsuario) {
        InscRenov e = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));
        e.setLancou(nomeUsuario);
        e.setDatalan(LocalDateTime.now());
        return toResponse(repository.save(e));
    }

    public PageResponse<InscRenovResponse> buscar(FiltroConsultaRequest filtro) {
        PageRequest pageable = PageRequest.of(
                filtro.getPage() < 0 ? 0 : filtro.getPage(),
                filtro.getSize() <= 0 ? 20 : filtro.getSize()
        );

        Page<InscRenov> page = repository.buscarComFiltros(
                filtro.getNome(),
                filtro.getCpf(),
                filtro.getUnloc(),
                filtro.getMemorandum(),
                filtro.getDescricao(),
                filtro.getLancou(),
                pageable
        );

        List<InscRenovResponse> content = page.getContent()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                page.getTotalPages(),
                page.getTotalElements(),
                page.getNumber(),
                page.getSize()
        );
    }

    public List<InscRenovResponse> buscarPorCpf(String cpf) {
        return repository.findByCpf(cpf)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private InscRenovResponse toResponse(InscRenov e) {
        InscRenovResponse r = new InscRenovResponse();
        r.setId(e.getId());
        r.setNome(e.getNome());
        r.setCpf(e.getCpf());
        r.setUnloc(e.getUnloc());
        r.setMemorandum(e.getMemorandum());
        r.setDatas(e.getDatas());
        r.setDescricao(e.getDescricao());
        r.setAnalise(e.getAnalise());
        r.setLancou(e.getLancou());
        r.setDatalan(e.getDatalan());
        r.setUrgente(e.getUrgente());
        return r;
    }
}