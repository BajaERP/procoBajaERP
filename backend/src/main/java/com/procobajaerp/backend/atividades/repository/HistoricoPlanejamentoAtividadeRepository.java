package com.procobajaerp.backend.atividades.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.atividades.domain.HistoricoPlanejamentoAtividade;

public interface HistoricoPlanejamentoAtividadeRepository extends JpaRepository<HistoricoPlanejamentoAtividade, Long> {

    @Query("""
            select h from HistoricoPlanejamentoAtividade h
            join fetch h.alteradoPor
            where h.atividade.id = :atividadeId
            order by h.alteradoEm desc, h.id desc
            """)
    List<HistoricoPlanejamentoAtividade> listarPorAtividade(Long atividadeId);
}
