package com.procobajaerp.backend.equipe.dto;

import com.procobajaerp.backend.equipe.domain.Subsistema;

public record SubsistemaResposta(Long id, String nome, String descricao, boolean ativo, Resumo lider) {

    public static SubsistemaResposta de(Subsistema subsistema) {
        return new SubsistemaResposta(
                subsistema.getId(),
                subsistema.getNome(),
                subsistema.getDescricao(),
                subsistema.isAtivo(),
                Resumo.de(subsistema.getLider()));
    }
}
