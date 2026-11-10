package com.procobajaerp.backend.equipe.dto;

import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;

/** Referência curta a um Usuário ou Subsistema dentro de outra resposta. */
public record Resumo(Long id, String nome) {

    public static Resumo de(Usuario usuario) {
        return usuario == null ? null : new Resumo(usuario.getId(), usuario.getNome());
    }

    public static Resumo de(Subsistema subsistema) {
        return subsistema == null ? null : new Resumo(subsistema.getId(), subsistema.getNome());
    }
}
