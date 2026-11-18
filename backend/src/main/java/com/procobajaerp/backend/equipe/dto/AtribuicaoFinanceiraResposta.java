package com.procobajaerp.backend.equipe.dto;

import java.time.OffsetDateTime;

import com.procobajaerp.backend.equipe.domain.AtribuicaoFinanceira;

/** Quem é o Gestor Financeiro. Com a posição vaga, os dois campos vêm nulos. */
public record AtribuicaoFinanceiraResposta(Resumo gestor, OffsetDateTime atribuidaEm) {

    public static final AtribuicaoFinanceiraResposta VAGA = new AtribuicaoFinanceiraResposta(null, null);

    public static AtribuicaoFinanceiraResposta de(AtribuicaoFinanceira atribuicao) {
        return new AtribuicaoFinanceiraResposta(Resumo.de(atribuicao.getGestor()), atribuicao.getAtribuidaEm());
    }
}
