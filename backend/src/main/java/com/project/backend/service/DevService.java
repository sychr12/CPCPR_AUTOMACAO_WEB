package com.project.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.backend.dto.request.DevRequest;
import com.project.backend.dto.request.FiltroConsultaRequest;
import com.project.backend.dto.response.DevResponse;
import com.project.backend.dto.response.PageResponse;
import com.project.backend.entity.Dev;
import com.project.backend.repository.DevRepository;

@Service
@Transactional
public class DevService {

    private final DevRepository repository;

    public DevService(DevRepository repository) {
        this.repository = repository;
    }

    public PageResponse<DevResponse> buscar(FiltroConsultaRequest filtro) {

        PageRequest pageable = PageRequest.of(
                filtro.getPage() < 0 ? 0 : filtro.getPage(),
                filtro.getSize() <= 0 ? 20 : filtro.getSize()
        );

        Page<Dev> page = repository.buscarComFiltros(
                filtro.getNome(),
                filtro.getCpf(),
                filtro.getUnloc(),
                filtro.getMemorandum(),
                pageable
        );

        List<DevResponse> dados = page.getContent()
                .stream()
                .map(this::converter)
                .collect(Collectors.toList());

        return new PageResponse<>(
                dados,
                page.getTotalPages(),
                page.getTotalElements(),
                page.getNumber(),
                page.getSize()
        );
    }

    public DevResponse criar(DevRequest request) {

        Dev dev = new Dev();
        dev.setNome(request.getNome());
        dev.setCpf(request.getCpf());
        dev.setUnloc(request.getUnloc());
        dev.setMemorandum(request.getMemorandum());

        Dev salvo = repository.save(dev);

        return converter(salvo);
    }

    public List<DevResponse> criarLote(List<DevRequest> requests) {

        List<Dev> devs = requests.stream().map(req -> {
            Dev dev = new Dev();
            dev.setNome(req.getNome());
            dev.setCpf(req.getCpf());
            dev.setUnloc(req.getUnloc());
            dev.setMemorandum(req.getMemorandum());
            return dev;
        }).collect(Collectors.toList());

        return repository.saveAll(devs)
                .stream()
                .map(this::converter)
                .collect(Collectors.toList());
    }

    public DevResponse atualizar(Long id, DevRequest request) {

        Dev dev = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));

        dev.setNome(request.getNome());
        dev.setCpf(request.getCpf());
        dev.setUnloc(request.getUnloc());
        dev.setMemorandum(request.getMemorandum());

        return converter(repository.save(dev));
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public List<DevResponse> buscarPendentes(String unloc, String memorando) {

        return repository
                .findByUnlocAndMemorandum(unloc, memorando)
                .stream()
                .map(this::converter)
                .collect(Collectors.toList());
    }

    public void marcarEnviado(String unloc, String memorando) {

        List<Dev> registros = repository
                .findByUnlocAndMemorandum(unloc, memorando);

        registros.forEach(dev -> dev.setEnvio(LocalDate.now()));

        repository.saveAll(registros);
    }

    private DevResponse converter(Dev dev) {

        DevResponse resp = new DevResponse();

        resp.setId(dev.getId());
        resp.setNome(dev.getNome());
        resp.setCpf(dev.getCpf());
        resp.setUnloc(dev.getUnloc());
        resp.setMemorandum(dev.getMemorandum());
        resp.setEnvio(dev.getEnvio());

        return resp;
    }
}