package com.procobajaerp.backend.auditoria.dto;

import java.time.OffsetDateTime;

import com.procobajaerp.backend.equipe.dto.Resumo;

/** Campos permitidos na interface de auditoria; os detalhes internos do registro não são expostos. */
public record EventoAuditoriaResposta(Long id, OffsetDateTime registradoEm, String atorNome,
        String entidade, String acao, String descricao, Resumo subsistemaOrigem, Resumo subsistemaDestino) {
}
