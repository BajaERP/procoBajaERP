package com.procobajaerp.backend.atividades.dto;

import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.dto.Resumo;

public record ResponsavelResumo(Long id, String nome, boolean ativo, Resumo subsistema) {

    public static ResponsavelResumo de(Usuario usuario) {
        return new ResponsavelResumo(usuario.getId(), usuario.getNome(), usuario.isAtivo(),
                Resumo.de(usuario.getSubsistema()));
    }
}
