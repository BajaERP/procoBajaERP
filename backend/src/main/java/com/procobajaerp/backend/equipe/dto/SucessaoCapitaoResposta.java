package com.procobajaerp.backend.equipe.dto;

import java.util.List;

/** Resultado e opções da sucessão, sem expor RA ou SIAPE de candidatos. */
public record SucessaoCapitaoResposta(UsuarioResposta capitaoAnterior, UsuarioResposta capitaoAtual) {

    public record Opcoes(List<Candidato> sucessores, List<Resumo> subsistemasDestino) {
    }

    public record Candidato(Long id, String nome, String perfil, boolean gestorFinanceiro, Resumo subsistema) {
    }
}
