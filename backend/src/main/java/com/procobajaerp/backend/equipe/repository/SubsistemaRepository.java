package com.procobajaerp.backend.equipe.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.equipe.domain.Subsistema;

public interface SubsistemaRepository extends JpaRepository<Subsistema, Long> {

    Optional<Subsistema> findByNomeIgnoreCase(String nome);

    @Query("select s from Subsistema s left join fetch s.lider")
    List<Subsistema> listarComLider();
}
