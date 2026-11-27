package com.procobajaerp.backend.atividades.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PlanejarSprintRequisicao(
        @NotBlank(message = "Informe o nome da Sprint.")
        @Size(max = 120, message = "O nome da Sprint deve ter no máximo 120 caracteres.")
        String nome,
        @Size(max = 5000, message = "O objetivo deve ter no máximo 5000 caracteres.")
        String objetivo,
        @NotNull(message = "Informe a data de início prevista da Sprint.")
        LocalDate inicio,
        LocalDate fim) {
}
