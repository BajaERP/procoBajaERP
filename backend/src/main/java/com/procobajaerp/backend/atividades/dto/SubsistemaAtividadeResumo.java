package com.procobajaerp.backend.atividades.dto;

import com.procobajaerp.backend.equipe.domain.Subsistema;

public record SubsistemaAtividadeResumo(Long id, String nome, boolean ativo) {

    public static SubsistemaAtividadeResumo de(Subsistema subsistema) {
        return new SubsistemaAtividadeResumo(subsistema.getId(), subsistema.getNome(), subsistema.isAtivo());
    }
}
