package com.procobajaerp.backend.atividades.dto;

import java.util.List;

import com.procobajaerp.backend.atividades.domain.EstadoAtividade;
import com.procobajaerp.backend.atividades.domain.RequisitoAlocacaoPendente;

public record CapacidadesAtividadeResposta(
        boolean podeEditarPlanejamento,
        boolean podeArquivar,
        boolean podeAlterarAndamento,
        List<EstadoAtividade> transicoesDisponiveis,
        boolean podeReabrir,
        boolean podeAlocar,
        List<RequisitoAlocacaoPendente> requisitosAlocacaoPendentes,
        boolean podeRetirarDaSprint) {
}
