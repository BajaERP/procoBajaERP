package com.procobajaerp.backend.atividades.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.atividades.domain.AlocacaoSprint;

public interface AlocacaoSprintRepository extends JpaRepository<AlocacaoSprint, Long> {

    @Query("""
            select al from AlocacaoSprint al
            join fetch al.sprint
            where al.atividade.id = :atividadeId and al.saidaEm is null
            """)
    Optional<AlocacaoSprint> buscarAbertaDaAtividade(Long atividadeId);

    @Query("""
            select al from AlocacaoSprint al
            join fetch al.sprint
            left join fetch al.transferidaPor
            left join fetch al.encerradaPor
            where al.atividade.id = :atividadeId
            order by al.entradaEm asc, al.id asc
            """)
    List<AlocacaoSprint> listarPorAtividade(Long atividadeId);

    @Query("""
            select al from AlocacaoSprint al
            join fetch al.sprint
            where al.atividade.id in :atividadeIds
            order by al.entradaEm asc, al.id asc
            """)
    List<AlocacaoSprint> listarPorAtividades(Collection<Long> atividadeIds);

    @Query("""
            select distinct al from AlocacaoSprint al
            join fetch al.sprint
            join fetch al.atividade a
            join fetch a.criadaPor
            left join fetch a.arquivadaPor
            left join fetch a.subsistemas
            left join fetch a.responsaveis r
            left join fetch r.subsistema
            where al.sprint.id = :sprintId
            order by al.entradaEm asc, al.id asc
            """)
    List<AlocacaoSprint> listarCompletasPorSprint(Long sprintId);

    @Query("""
            select distinct al from AlocacaoSprint al
            join fetch al.sprint
            join fetch al.atividade a
            left join fetch a.subsistemas
            left join fetch a.responsaveis
            where al.sprint.id in :sprintIds
            """)
    List<AlocacaoSprint> listarComAtividadePorSprints(Collection<Long> sprintIds);
}
