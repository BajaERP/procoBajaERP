package com.procobajaerp.backend.atividades.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.atividades.domain.Atividade;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Atividade a where a.id = :id")
    Optional<Atividade> travar(Long id);

    @Query("""
            select distinct a from Atividade a
            join fetch a.criadaPor
            left join fetch a.arquivadaPor
            left join fetch a.subsistemas
            left join fetch a.responsaveis r
            left join fetch r.subsistema
            """)
    List<Atividade> listarCompletas();

    @Query("""
            select distinct a from Atividade a
            join fetch a.criadaPor
            left join fetch a.arquivadaPor
            left join fetch a.subsistemas
            left join fetch a.responsaveis r
            left join fetch r.subsistema
            where a.id = :id
            """)
    Optional<Atividade> buscarCompleta(Long id);
}
