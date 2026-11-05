package com.procobajaerp.backend.seguranca.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequisicao(
        @NotBlank(message = "Informe o RA.") String ra,
        @NotBlank(message = "Informe a senha.") String senha) {
}
