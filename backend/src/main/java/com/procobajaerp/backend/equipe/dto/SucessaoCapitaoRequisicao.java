package com.procobajaerp.backend.equipe.dto;

import jakarta.validation.constraints.NotNull;

/** O Capitão escolhe seu sucessor ativo e o Subsistema em que continuará como Membro. */
public record SucessaoCapitaoRequisicao(
        @NotNull(message = "Escolha o próximo Capitão.") Long sucessorId,
        @NotNull(message = "Escolha o Subsistema do Capitão atual.") Long subsistemaDestinoId) {
}
