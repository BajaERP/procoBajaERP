package com.procobajaerp.backend.equipe.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.equipe.domain.Subsistema;

public interface SubsistemaRepository extends JpaRepository<Subsistema, Long> {

    Optional<Subsistema> findByNomeIgnoreCase(String nome);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Subsistema s where s.id = :id")
    Optional<Subsistema> travar(Long id);

    boolean existsByAtivoTrueAndIdNot(Long id);

    @Query("select s from Subsistema s left join fetch s.lider")
    List<Subsistema> listarComLider();
}
