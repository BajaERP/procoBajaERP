package com.procobajaerp.backend.equipe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DadosDeSubsistemaRequisicao(
        @NotBlank(message = "Informe o nome.") @Size(max = 120, message = "O nome deve ter até 120 caracteres.") String nome,
        String descricao) {
}
