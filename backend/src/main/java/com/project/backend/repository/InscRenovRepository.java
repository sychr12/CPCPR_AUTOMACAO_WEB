package com.project.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.backend.entity.InscRenov;

public interface InscRenovRepository extends JpaRepository<InscRenov, Long> {

    @Query("SELECT i FROM InscRenov i WHERE " +
           "(:nome IS NULL OR LOWER(i.nome) LIKE LOWER(CONCAT('%',:nome,'%'))) AND " +
           "(:cpf IS NULL OR i.cpf = :cpf) AND " +
           "(:unloc IS NULL OR i.unloc = :unloc) AND " +
           "(:memorando IS NULL OR i.memorando = :memorando) AND " +
           "(:descricao IS NULL OR i.descricao = :descricao) AND " +
           "(:lancou IS NULL OR i.lancou IS NOT NULL)")
    Page<InscRenov> buscarComFiltros(
        @Param("nome") String nome,
        @Param("cpf") String cpf,
        @Param("unloc") String unloc,
        @Param("memorando") String memorando,
        @Param("descricao") String descricao,
        @Param("lancou") String lancou,
        Pageable pageable
    );

    List<InscRenov> findByCpf(String cpf);
}