package com.procobajaerp.backend.atividades.domain;

/** Prioridade de planejamento da Atividade, ordenada da mais urgente para a mais baixa. */
public enum PrioridadeAtividade {

    BAIXA(3),
    MEDIA(2),
    ALTA(1),
    URGENTE(0);

    private final int pesoOrdenacao;

    PrioridadeAtividade(int pesoOrdenacao) {
        this.pesoOrdenacao = pesoOrdenacao;
    }

    public int pesoOrdenacao() {
        return pesoOrdenacao;
    }
}
