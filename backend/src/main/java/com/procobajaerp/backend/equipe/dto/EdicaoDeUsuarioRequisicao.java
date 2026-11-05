package com.procobajaerp.backend.equipe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EdicaoDeUsuarioRequisicao(
        @NotBlank(message = "Informe o nome.") @Size(max = 150, message = "O nome deve ter até 150 caracteres.") String nome,
        @NotBlank(message = "Informe o RA.") String ra) {
}
