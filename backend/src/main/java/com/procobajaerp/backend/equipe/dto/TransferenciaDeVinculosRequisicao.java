package com.procobajaerp.backend.equipe.dto;

import jakarta.validation.constraints.NotNull;

public record TransferenciaDeVinculosRequisicao(
        @NotNull(message = "Informe o Gestor de origem.") Long gestorOrigemId,
        @NotNull(message = "Informe o Gestor de destino.") Long gestorDestinoId) {
}
