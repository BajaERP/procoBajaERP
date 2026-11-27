package com.procobajaerp.backend.atividades.dto;

import java.time.LocalDate;

import com.procobajaerp.backend.atividades.domain.SituacaoSprint;
import com.procobajaerp.backend.atividades.domain.Sprint;

public record SprintResumo(Long id, String nome, LocalDate inicio, LocalDate fim, SituacaoSprint situacao) {

    public static SprintResumo de(Sprint sprint) {
        return sprint == null ? null
                : new SprintResumo(sprint.getId(), sprint.getNome(), sprint.getInicio(), sprint.getFim(),
                        sprint.getSituacao());
    }
}
