package com.procobajaerp.backend.equipe.dto;

import jakarta.validation.constraints.NotNull;

import com.procobajaerp.backend.equipe.domain.Perfil;

/**
 * O Subsistema só é informado por quem ainda não tem um e passa a um Perfil que exige.
 */
public record TrocaDePerfilRequisicao(@NotNull(message = "Informe o novo Perfil.") Perfil perfil, Long subsistemaId) {
}
