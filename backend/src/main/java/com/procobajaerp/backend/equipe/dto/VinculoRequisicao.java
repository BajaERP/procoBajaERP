package com.procobajaerp.backend.equipe.dto;

import jakarta.validation.constraints.NotNull;

public record VinculoRequisicao(@NotNull(message = "Informe o Gestor.") Long gestorId) {
}
