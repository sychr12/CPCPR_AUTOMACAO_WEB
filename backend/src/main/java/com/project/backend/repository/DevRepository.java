package com.project.backend.repository;

import com.project.backend.entity.Dev;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DevRepository extends JpaRepository<Dev, Long>, JpaSpecificationExecutor<Dev> {

    List<Dev> findByUnlocAndMemorandoAndEnvioIsNull(String unloc, String memorando);
}