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
}
