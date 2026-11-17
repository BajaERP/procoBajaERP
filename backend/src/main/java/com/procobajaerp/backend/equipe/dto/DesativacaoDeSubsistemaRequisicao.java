package com.procobajaerp.backend.equipe.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

/**
 * Para onde vai cada Usuário do Subsistema desativado, inclusive os desativados: um Subsistema ativo por Usuário,
 * podendo ser diferentes. O Líder vai como Membro. Subsistema vazio dispensa a lista.
 */
public record DesativacaoDeSubsistemaRequisicao(@Valid List<@NotNull(message = "Informe o destino.") Destino> destinos) {

    public record Destino(
            @NotNull(message = "Informe o Usuário.") Long usuarioId,
            @NotNull(message = "Informe o Subsistema de destino.") Long subsistemaId) {
    }

    public List<Destino> destinosInformados() {
        return destinos == null ? List.of() : destinos;
    }
}
