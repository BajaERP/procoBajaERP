package com.procobajaerp.backend.atividades.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

import com.procobajaerp.backend.atividades.domain.EstadoAtividade;
import com.procobajaerp.backend.atividades.domain.PrioridadeAtividade;
import com.procobajaerp.backend.equipe.dto.Resumo;

public record AtividadeDetalheResposta(
        Long id,
        String titulo,
        String descricao,
        EstadoAtividade status,
        PrioridadeAtividade prioridade,
        Integer estimativaFibonacci,
        LocalDate prazo,
        boolean compartilhada,
        List<SubsistemaAtividadeResumo> subsistemas,
        List<ResponsavelResumo> responsaveis,
        AlocacaoAtualResumo alocacaoAtual,
        int quantidadeTransferencias,
        ArquivamentoResumo arquivamento,
        AlertasAtividadeResumo alertas,
        CapacidadesAtividadeResposta capacidades,
        Resumo criadaPor,
        OffsetDateTime criadaEm,
        OffsetDateTime atualizadaEm,
        OffsetDateTime concluidaEm) {
}
