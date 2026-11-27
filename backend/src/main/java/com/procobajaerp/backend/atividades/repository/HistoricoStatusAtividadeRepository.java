package com.procobajaerp.backend.atividades.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.atividades.domain.HistoricoStatusAtividade;

public interface HistoricoStatusAtividadeRepository extends JpaRepository<HistoricoStatusAtividade, Long> {

    @Query("""
            select h from HistoricoStatusAtividade h
            join fetch h.alteradoPor
            where h.atividade.id = :atividadeId
            order by h.alteradoEm desc, h.id desc
            """)
    List<HistoricoStatusAtividade> listarPorAtividade(Long atividadeId);
}
