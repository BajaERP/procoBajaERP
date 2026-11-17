package com.procobajaerp.backend.equipe.dto;

import jakarta.validation.constraints.NotNull;

/** Gestor ativo que recebe a responsabilidade financeira, vaga ou vinda de outro Gestor. */
public record AtribuicaoFinanceiraRequisicao(@NotNull(message = "Informe o Gestor.") Long gestorId) {
}
