package com.procobajaerp.backend.equipe.domain;

import java.util.EnumSet;
import java.util.Set;

/** Os seis Perfis do ERP, com os nomes gravados na tabela {@code perfis}. Cada Usuário tem um só. */
public enum Perfil {

    CAPITAO_ADMIN("Capitão"),
    GESTOR("Gestor"),
    FINANCEIRO("Financeiro"),
    LIDER("Líder"),
    MEMBRO("Membro"),
    ORIENTADOR("Orientador");

    private static final Set<Perfil> ADMINISTRADOS_PELO_GESTOR = EnumSet.of(FINANCEIRO, LIDER, MEMBRO, ORIENTADOR);

    private final String rotulo;

    Perfil(String rotulo) {
        this.rotulo = rotulo;
    }

    public String rotulo() {
        return rotulo;
    }

    /** O Capitão administra Usuários de qualquer Perfil; o Gestor, só Financeiro, Líder, Membro e Orientador. */
    public boolean administra(Perfil outro) {
        return switch (this) {
            case CAPITAO_ADMIN -> true;
            case GESTOR -> ADMINISTRADOS_PELO_GESTOR.contains(outro);
            default -> false;
        };
    }

    /** Capitão e Gestor veem Usuários e Subsistemas desativados e o RA de qualquer Usuário. */
    public boolean administraEquipe() {
        return this == CAPITAO_ADMIN || this == GESTOR;
    }

    /** O Capitão não pertence a nenhum Subsistema, porque atua em todos. */
    public boolean admiteSubsistema() {
        return this != CAPITAO_ADMIN;
    }

    /** O Orientador pode pertencer ou não a um Subsistema; os demais, exceto o Capitão, precisam de um. */
    public boolean exigeSubsistema() {
        return this != CAPITAO_ADMIN && this != ORIENTADOR;
    }

    /** Líder e Membro veem só a Composição do próprio Subsistema; os demais veem a de todos. */
    public boolean veComposicaoGeral() {
        return this != LIDER && this != MEMBRO;
    }
}
