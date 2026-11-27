package com.procobajaerp.backend.atividades.dto;

import jakarta.validation.constraints.NotNull;

public record AlocarAtividadeRequisicao(@NotNull(message = "Informe a Atividade a alocar.") Long atividadeId) {
}
