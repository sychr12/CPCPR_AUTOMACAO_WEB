package com.project.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.backend.entity.Dev;

@Repository
public interface DevRepository extends JpaRepository<Dev, Long> {

    @Query("""
        SELECT d FROM Dev d
        WHERE (:nome IS NULL OR LOWER(d.nome) LIKE LOWER(CONCAT('%', :nome, '%')))
        AND (:cpf IS NULL OR d.cpf = :cpf)
        AND (:unloc IS NULL OR d.unloc = :unloc)
        AND (:memorando IS NULL OR d.memorando = :memorando)
    """)
    Page<Dev> buscarComFiltros(
            @Param("nome") String nome,
            @Param("cpf") String cpf,
            @Param("unloc") String unloc,
            @Param("memorando") String memorando,
            Pageable pageable
    );

    List<Dev> findByCpf(String cpf);

    List<Dev> findByEnvioIsNull();

    List<Dev> findByUnlocAndMemorandoAndEnvioIsNull(String unloc, String memorando);
}