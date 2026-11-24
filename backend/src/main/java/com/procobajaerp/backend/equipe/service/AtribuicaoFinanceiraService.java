package com.procobajaerp.backend.equipe.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.domain.Visibilidade;
import com.procobajaerp.backend.equipe.dto.AtribuicaoFinanceiraResposta;
import com.procobajaerp.backend.equipe.repository.SubsistemaRepository;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.shared.AcessoNegadoException;
import com.procobajaerp.backend.shared.NaoEncontradoException;

/** Consulta quem exerce a responsabilidade financeira por estar associado ao Subsistema Financeiro. */
@Service
@Transactional(readOnly = true)
public class AtribuicaoFinanceiraService {

    private final SubsistemaRepository subsistemas;
    private final UsuarioRepository usuarios;

    public AtribuicaoFinanceiraService(SubsistemaRepository subsistemas, UsuarioRepository usuarios) {
        this.subsistemas = subsistemas;
        this.usuarios = usuarios;
    }

    public AtribuicaoFinanceiraResposta consultar(Long atorId) {
        Usuario ator = usuarios.buscarCompleto(atorId).orElseThrow(AtribuicaoFinanceiraService::usuarioNaoEncontrado);
        Subsistema financeiro = subsistemas.findByNomeIgnoreCase("Financeiro").orElse(null);
        Usuario gestor = financeiro == null ? null : usuarios.buscarGestorFinanceiroAtivo(
                Perfil.GESTOR, financeiro.getId()).orElse(null);

        if (ator.getPerfil().administraEquipe()) {
            return AtribuicaoFinanceiraResposta.de(gestor);
        }
        if (gestor == null || !Visibilidade.podeVer(ator, gestor)) {
            throw new AcessoNegadoException("Você não tem permissão para consultar a responsabilidade financeira.");
        }
        return AtribuicaoFinanceiraResposta.de(gestor);
    }

    private static NaoEncontradoException usuarioNaoEncontrado() {
        return new NaoEncontradoException("Usuário não encontrado.");
    }
}
