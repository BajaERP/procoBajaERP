package com.procobajaerp.backend.atividades.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

import com.procobajaerp.backend.atividades.domain.EstadoAtividade;
import com.procobajaerp.backend.atividades.domain.PrioridadeAtividade;

public record AtividadeResumoResposta(
        Long id,
        String titulo,
        EstadoAtividade status,
        PrioridadeAtividade prioridade,
        Integer estimativaFibonacci,
        LocalDate prazo,
        boolean compartilhada,
        List<SubsistemaAtividadeResumo> subsistemas,
        List<ResponsavelResumo> responsaveis,
        AlocacaoAtualResumo alocacaoAtual,
        int quantidadeTransferencias,
        boolean arquivada,
        AlertasAtividadeResumo alertas,
        CapacidadesAtividadeResposta capacidades,
        OffsetDateTime criadaEm,
        OffsetDateTime atualizadaEm) {
}
