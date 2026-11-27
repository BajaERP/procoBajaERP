package com.procobajaerp.backend.atividades.dto;

import java.util.List;

public record OpcoesAtividadesResposta(
        CapacidadesModuloResposta capacidades,
        List<SubsistemaAtividadeResumo> subsistemasDisponiveis,
        List<SubsistemaAtividadeResumo> subsistemasFiltro,
        List<ResponsavelResumo> responsaveisDisponiveis,
        List<SprintResumo> sprintsSelecionaveis,
        List<Integer> estimativasPermitidas) {
}
