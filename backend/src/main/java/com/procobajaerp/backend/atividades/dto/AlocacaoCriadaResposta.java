package com.procobajaerp.backend.atividades.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

import com.procobajaerp.backend.atividades.domain.DesfechoAlocacao;
import com.procobajaerp.backend.atividades.domain.EstadoAtividade;
import com.procobajaerp.backend.atividades.domain.PrioridadeAtividade;
import com.procobajaerp.backend.atividades.domain.TipoEntradaSprint;

public record AlocacaoCriadaResposta(AlocacaoResumo alocacao, AtividadeAlocadaResumo atividade) {

    public record AlocacaoResumo(
            Long id,
            TipoEntradaSprint origem,
            OffsetDateTime entradaEm,
            OffsetDateTime saidaEm,
            DesfechoAlocacao desfecho,
            SprintResumo sprint) {
    }

    public record AtividadeAlocadaResumo(
            Long id,
            String titulo,
            EstadoAtividade status,
            PrioridadeAtividade prioridade,
            Integer estimativaFibonacci,
            LocalDate prazo,
            boolean compartilhada,
            List<SubsistemaAtividadeResumo> subsistemas,
            List<ResponsavelResumo> responsaveis) {
    }
}
