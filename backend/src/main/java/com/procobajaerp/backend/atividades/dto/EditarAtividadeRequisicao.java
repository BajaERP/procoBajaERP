package com.procobajaerp.backend.atividades.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.procobajaerp.backend.atividades.domain.PrioridadeAtividade;

public record EditarAtividadeRequisicao(
        @NotBlank(message = "Informe o título da Atividade.")
        @Size(max = 180, message = "O título deve ter no máximo 180 caracteres.")
        String titulo,
        @Size(max = 5000, message = "A descrição deve ter no máximo 5000 caracteres.")
        String descricao,
        PrioridadeAtividade prioridade,
        Integer estimativaFibonacci,
        LocalDate prazo,
        @NotEmpty(message = "Selecione ao menos um Subsistema.")
        List<@NotNull(message = "Informe um Subsistema válido.") Long> subsistemaIds,
        List<@NotNull(message = "Informe um Responsável válido.") Long> responsavelIds) {
}
