package com.procobajaerp.backend.atividades.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ArquivarAtividadeRequisicao(
        @NotBlank(message = "Informe o motivo do arquivamento.")
        @Size(max = 2000, message = "O motivo do arquivamento deve ter no máximo 2000 caracteres.")
        String motivo) {
}
