package com.procobajaerp.backend.seguranca.dto;

import java.util.List;

import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.dto.Resumo;
import com.procobajaerp.backend.seguranca.UsuarioAutenticado;

/** Quem está logado, com as permissões do Perfil para o frontend decidir o que mostrar. */
public record UsuarioAtualResposta(Long id, String nome, String ra, Perfil perfil, Resumo subsistema, List<String> permissoes) {

    public static UsuarioAtualResposta de(UsuarioAutenticado usuario) {
        return new UsuarioAtualResposta(
                usuario.getId(),
                usuario.getNome(),
                usuario.getRa(),
                usuario.getPerfil(),
                usuario.getSubsistemaId() == null ? null : new Resumo(usuario.getSubsistemaId(), usuario.getSubsistemaNome()),
                usuario.getPermissoes().stream().sorted().toList());
    }
}
