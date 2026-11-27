package com.procobajaerp.backend.atividades.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.atividades.domain.Atividade;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> {

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
