package com.procobajaerp.backend.equipe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.procobajaerp.backend.equipe.domain.Perfil;

/**
 * O Subsistema é proibido para o Capitão, opcional para o Orientador e obrigatório para os demais. O Gestor
 * só é informado quando o Capitão cadastra um Financeiro.
 */
public record CadastroDeUsuarioRequisicao(
        @NotBlank(message = "Informe o nome.") @Size(max = 150, message = "O nome deve ter até 150 caracteres.") String nome,
        @NotBlank(message = "Informe o RA.") String ra,
        @NotNull(message = "Informe o Perfil.") Perfil perfil,
        Long subsistemaId,
        Long gestorId) {
}
