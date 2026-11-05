package com.procobajaerp.backend.equipe.domain;

/** O que cada Perfil vê da equipe (RF32): Composições, Usuários desativados e o RA. */
public final class Visibilidade {

    private Visibilidade() {
    }

    /**
     * Cada um vê a si mesmo. Desativados só aparecem para Capitão e Gestor. Líder e Membro veem só quem é do
     * próprio Subsistema; os demais Perfis veem toda a equipe.
     */
    public static boolean podeVer(Usuario quem, Usuario alvo) {
        if (quem.mesmoUsuario(alvo)) {
            return true;
        }
        if (!alvo.isAtivo() && !quem.getPerfil().administraEquipe()) {
            return false;
        }
        return quem.getPerfil().veComposicaoGeral() || alvo.pertenceA(quem.getSubsistema());
    }

    /** O RA só aparece para o próprio Usuário, o Capitão e o Gestor. */
    public static boolean podeVerRa(Usuario quem, Usuario alvo) {
        return quem.mesmoUsuario(alvo) || quem.getPerfil().administraEquipe();
    }

    public static boolean podeVerComposicao(Usuario quem, Subsistema subsistema) {
        return quem.getPerfil().veComposicaoGeral() || quem.pertenceA(subsistema);
    }

    /** Nomes e Líderes dos Subsistemas ativos são de todos; os desativados, só de Capitão e Gestor. */
    public static boolean podeVer(Usuario quem, Subsistema subsistema) {
        return subsistema.isAtivo() || quem.getPerfil().administraEquipe();
    }
}
