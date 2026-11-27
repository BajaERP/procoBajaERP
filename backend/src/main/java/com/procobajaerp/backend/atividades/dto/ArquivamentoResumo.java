package com.procobajaerp.backend.atividades.dto;

import java.time.OffsetDateTime;

import com.procobajaerp.backend.atividades.domain.Atividade;
import com.procobajaerp.backend.equipe.dto.Resumo;

public record ArquivamentoResumo(OffsetDateTime arquivadaEm, Resumo arquivadaPor, String motivo) {

    public static ArquivamentoResumo de(Atividade atividade) {
        if (!atividade.isArquivada()) {
            return null;
        }
        return new ArquivamentoResumo(atividade.getArquivadaEm(), Resumo.de(atividade.getArquivadaPor()),
                atividade.getMotivoArquivamento());
    }
}
