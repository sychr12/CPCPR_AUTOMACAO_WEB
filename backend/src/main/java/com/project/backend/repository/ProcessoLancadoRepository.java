package com.project.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.backend.entity.ProcessoLancado;

public interface ProcessoLancadoRepository extends JpaRepository<ProcessoLancado, Long> {
    Optional<ProcessoLancado> findByArquivo(String arquivo);
    List<ProcessoLancado> findByCpf(String cpf);
}