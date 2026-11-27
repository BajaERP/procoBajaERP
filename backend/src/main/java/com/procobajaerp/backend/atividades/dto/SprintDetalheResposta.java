package com.procobajaerp.backend.atividades.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

import com.procobajaerp.backend.atividades.domain.SituacaoSprint;
import com.procobajaerp.backend.equipe.dto.Resumo;

public record SprintDetalheResposta(
        Long id,
        String nome,
        String objetivo,
        LocalDate inicio,
        LocalDate fim,
        OffsetDateTime iniciadaEm,
        OffsetDateTime encerradaEm,
        SituacaoSprint situacao,
        Resumo criadaPor,
        Resumo iniciadaPor,
        Resumo encerradaPor,
        ResumoPassagensSprint resumo,
        AlertasSprintResumo alertas,
        CapacidadesSprintResposta capacidades,
        List<PassagemSprintResposta> passagens) {
}
