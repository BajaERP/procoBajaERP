package com.procobajaerp.backend.equipe.dto;

import jakarta.validation.constraints.NotNull;

/** Usuário escolhido como Líder ou transferido para o Subsistema. */
public record IntegranteRequisicao(@NotNull(message = "Informe o Usuário.") Long usuarioId) {
}
