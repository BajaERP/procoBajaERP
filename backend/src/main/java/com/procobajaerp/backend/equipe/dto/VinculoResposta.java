package com.procobajaerp.backend.equipe.dto;

import java.time.OffsetDateTime;

import com.procobajaerp.backend.equipe.domain.VinculoFinanceiroGestor;

public record VinculoResposta(Resumo financeiro, boolean financeiroAtivo, Resumo gestor, OffsetDateTime definidoEm) {

    public static VinculoResposta de(VinculoFinanceiroGestor vinculo) {
        return new VinculoResposta(
                Resumo.de(vinculo.getFinanceiro()),
                vinculo.getFinanceiro().isAtivo(),
                Resumo.de(vinculo.getGestor()),
                vinculo.getDefinidoEm());
    }
}
