package com.project.backend.service;

import com.project.backend.entity.Dev;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DevRepository extends JpaRepository<Dev, Long> {

    @Query("""
        SELECT d FROM Dev d
        WHERE (:nome IS NULL OR LOWER(d.nome) LIKE LOWER(CONCAT('%', :nome, '%')))
        AND (:cpf IS NULL OR d.cpf = :cpf)
        AND (:unloc IS NULL OR d.unloc = :unloc)
        AND (:memorandum IS NULL OR d.memorandum = :memorandum)
    """)
    Page<Dev> buscarComFiltros(
            @Param("nome") String nome,
            @Param("cpf") String cpf,
            @Param("unloc") String unloc,
            @Param("memorandum") String memorandum,
            Pageable pageable
    );

    List<Dev> findByUnlocAndMemorandumAndEnvioIsNull(
            String unloc,
            String memorandum
    );
}