package com.procobajaerp.backend.seguranca.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TrocaDeSenhaRequisicao(
        @NotBlank(message = "Informe a senha atual.") String senhaAtual,
        @NotBlank(message = "Informe a nova senha.")
        @Size(min = 8, max = 64, message = "A nova senha deve ter de 8 a 64 caracteres.") String novaSenha) {
}
