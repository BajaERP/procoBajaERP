package com.procobajaerp.backend.atividades.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

import com.procobajaerp.backend.atividades.domain.DesfechoAlocacao;
import com.procobajaerp.backend.atividades.domain.EstadoAtividade;
import com.procobajaerp.backend.atividades.domain.PrioridadeAtividade;
import com.procobajaerp.backend.atividades.domain.TipoEntradaSprint;

public record PassagemSprintResposta(
        Long alocacaoId,
        Long atividadeId,
        String titulo,
        PrioridadeAtividade prioridade,
        Integer estimativaFibonacci,
        LocalDate prazo,
        boolean compartilhada,
        List<SubsistemaAtividadeResumo> subsistemas,
        List<ResponsavelResumo> responsaveis,
        TipoEntradaSprint origem,
        DesfechoAlocacao desfecho,
        EstadoAtividade estadoNoEncerramento,
        EstadoAtividade estadoAtual,
        boolean retiradaAntesEncerramento,
        OffsetDateTime entradaEm,
        OffsetDateTime saidaEm) {
}
