package com.procobajaerp.backend.atividades.dto;

import java.time.OffsetDateTime;

import com.procobajaerp.backend.atividades.domain.AlocacaoSprint;
import com.procobajaerp.backend.atividades.domain.TipoEntradaSprint;

public record AlocacaoAtualResumo(Long id, TipoEntradaSprint origem, OffsetDateTime entradaEm, SprintResumo sprint) {

    public static AlocacaoAtualResumo de(AlocacaoSprint alocacao) {
        return alocacao == null ? null
                : new AlocacaoAtualResumo(alocacao.getId(), alocacao.getOrigem(), alocacao.getEntradaEm(),
                        SprintResumo.de(alocacao.getSprint()));
    }
}
