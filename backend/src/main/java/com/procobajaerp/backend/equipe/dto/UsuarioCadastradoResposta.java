package com.procobajaerp.backend.equipe.dto;

/** A Senha provisória só aparece nesta resposta; o ERP guarda apenas o hash. */
public record UsuarioCadastradoResposta(UsuarioResposta usuario, String senhaProvisoria) {
}
