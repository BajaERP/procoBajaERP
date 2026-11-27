package com.procobajaerp.backend.atividades.domain;

import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;

/** Regras de visibilidade e autorização por Perfil e escopo para Atividades e Sprints (RF32). */
public final class PoliticaAtividades {

    private PoliticaAtividades() {
    }

    public static boolean podeGerenciarSprints(Usuario ator) {
        return ator.getPerfil().administraEquipe();
    }

    public static boolean podeCriarAtividade(Usuario ator) {
        return ator.getPerfil().administraEquipe()
                || (ator.getPerfil() == Perfil.LIDER && ator.getSubsistema() != null && ator.getSubsistema().isAtivo());
    }

    public static boolean podeCriarAtividadeCompartilhada(Usuario ator) {
        return ator.getPerfil().administraEquipe();
    }

    public static boolean podeVer(Usuario ator, Atividade atividade) {
        return switch (ator.getPerfil()) {
            case CAPITAO_ADMIN, GESTOR -> true;
            case ORIENTADOR -> atividade.temSubsistemaAtivo();
            case LIDER -> atividade.temSubsistemaAtivo()
                    || (ator.getSubsistema() != null && atividade.envolveSubsistema(ator.getSubsistema().getId()))
                    || atividade.temResponsavel(ator.getId());
            case MEMBRO -> (ator.getSubsistema() != null && atividade.envolveSubsistema(ator.getSubsistema().getId()))
                    || atividade.temResponsavel(ator.getId());
        };
    }

    /** Para filtros e opções de criação/edição: quais Subsistemas o Usuário vê ou pode usar. */
    public static boolean podeVerSubsistemaNoFiltro(Usuario ator, Subsistema subsistema) {
        return switch (ator.getPerfil()) {
            case CAPITAO_ADMIN, GESTOR -> true;
            case ORIENTADOR -> subsistema.isAtivo();
            case LIDER -> subsistema.isAtivo() || ator.pertenceA(subsistema);
            case MEMBRO -> ator.pertenceA(subsistema);
        };
    }

    public static boolean podeEditarPlanejamento(Usuario ator, Atividade atividade) {
        if (atividade.isArquivada()) {
            return false;
        }
        return switch (ator.getPerfil()) {
            case CAPITAO_ADMIN, GESTOR -> true;
            case LIDER -> ator.getSubsistema() != null
                    && atividade.exclusivaDoSubsistema(ator.getSubsistema().getId());
            case MEMBRO, ORIENTADOR -> false;
        };
    }

    public static boolean podeArquivar(Usuario ator, Atividade atividade, boolean alocada) {
        if (atividade.isArquivada()) {
            return false;
        }
        return switch (ator.getPerfil()) {
            case CAPITAO_ADMIN, GESTOR -> true;
            case LIDER -> !alocada && ator.getSubsistema() != null
                    && atividade.exclusivaDoSubsistema(ator.getSubsistema().getId());
            case MEMBRO, ORIENTADOR -> false;
        };
    }

    public static boolean podeAlterarAndamento(Usuario ator, Atividade atividade) {
        if (atividade.isArquivada()) {
            return false;
        }
        return switch (ator.getPerfil()) {
            case CAPITAO_ADMIN, GESTOR -> true;
            case LIDER -> (ator.getSubsistema() != null && atividade.envolveSubsistema(ator.getSubsistema().getId()))
                    || atividade.temResponsavel(ator.getId());
            case MEMBRO -> atividade.temResponsavel(ator.getId());
            case ORIENTADOR -> false;
        };
    }

    public static boolean podeReabrir(Usuario ator, Atividade atividade) {
        if (atividade.isArquivada()) {
            return false;
        }
        return switch (ator.getPerfil()) {
            case CAPITAO_ADMIN, GESTOR -> true;
            case LIDER -> ator.getSubsistema() != null
                    && atividade.exclusivaDoSubsistema(ator.getSubsistema().getId());
            case MEMBRO, ORIENTADOR -> false;
        };
    }
}
