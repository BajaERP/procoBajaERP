package com.procobajaerp.backend.atividades.domain;

import java.util.List;

/**
 * Situação da Atividade no Kanban. {@code NAO_CONCLUIDA} nunca entra como estado de trabalho atual: registra
 * apenas o desfecho histórico quando uma pendência permanece aberta no encerramento da Sprint.
 */
public enum EstadoAtividade {

    NAO_INICIADA,
    NAO_CONCLUIDA,
    EM_ANDAMENTO,
    CONCLUIDA,
    PAUSADA;

    public boolean ehEstadoDeTrabalho() {
        return this != NAO_CONCLUIDA;
    }

    public List<EstadoAtividade> transicoesDisponiveis() {
        return switch (this) {
            case NAO_INICIADA -> List.of(EM_ANDAMENTO);
            case EM_ANDAMENTO -> List.of(PAUSADA, CONCLUIDA);
            case PAUSADA -> List.of(EM_ANDAMENTO);
            case CONCLUIDA, NAO_CONCLUIDA -> List.of();
        };
    }
}
