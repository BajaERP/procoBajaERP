package com.procobajaerp.backend.equipe.dto;

import com.procobajaerp.backend.equipe.domain.Usuario;

/** Quem é o Gestor Financeiro por pertencer ao Subsistema Financeiro. */
public record AtribuicaoFinanceiraResposta(Resumo gestor) {

    public static final AtribuicaoFinanceiraResposta VAGA = new AtribuicaoFinanceiraResposta(null);

    public static AtribuicaoFinanceiraResposta de(Usuario gestor) {
        return gestor == null ? VAGA : new AtribuicaoFinanceiraResposta(Resumo.de(gestor));
    }
}
