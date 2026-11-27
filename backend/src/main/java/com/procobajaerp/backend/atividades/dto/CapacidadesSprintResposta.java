package com.procobajaerp.backend.atividades.dto;

public record CapacidadesSprintResposta(
        boolean podeEditar,
        boolean podeIniciar,
        String motivoBloqueioInicio,
        boolean podeAlocarAtividades,
        boolean podeEncerrar) {
}
