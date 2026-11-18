package com.procobajaerp.backend.equipe.dto;

import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Usuario;

/** O RA vem nulo quando quem consulta não pode vê-lo. Quem vê o Usuário vê também se ele é o Gestor Financeiro. */
public record UsuarioResposta(Long id, String nome, String ra, Perfil perfil, boolean gestorFinanceiro, Resumo subsistema,
        boolean ativo) {

    public static UsuarioResposta de(Usuario usuario, boolean comRa) {
        return new UsuarioResposta(
                usuario.getId(),
                usuario.getNome(),
                comRa ? usuario.getRa() : null,
                usuario.getPerfil(),
                usuario.isGestorFinanceiro(),
                Resumo.de(usuario.getSubsistema()),
                usuario.isAtivo());
    }
}
