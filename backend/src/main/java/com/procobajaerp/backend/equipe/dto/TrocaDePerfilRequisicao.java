package com.procobajaerp.backend.equipe.dto;

import jakarta.validation.constraints.NotNull;

import com.procobajaerp.backend.equipe.domain.Perfil;

/**
 * O Subsistema só é informado por quem ainda não tem um e passa a um Perfil que exige. O Gestor só é
 * informado quando o Capitão torna alguém Financeiro.
 */
public record TrocaDePerfilRequisicao(@NotNull(message = "Informe o novo Perfil.") Perfil perfil, Long subsistemaId, Long gestorId) {
}
