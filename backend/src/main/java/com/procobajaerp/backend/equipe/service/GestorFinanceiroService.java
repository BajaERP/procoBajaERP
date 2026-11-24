package com.procobajaerp.backend.equipe.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.repository.SubsistemaRepository;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.shared.ConflitoException;
import com.procobajaerp.backend.shared.NaoEncontradoException;

/** Serializa e valida mudanças de associação que podem tornar alguém Gestor Financeiro. */
@Service
@Transactional
public class GestorFinanceiroService {

    private final SubsistemaRepository subsistemas;
    private final UsuarioRepository usuarios;

    public GestorFinanceiroService(SubsistemaRepository subsistemas, UsuarioRepository usuarios) {
        this.subsistemas = subsistemas;
        this.usuarios = usuarios;
    }

    public Subsistema subsistemaFinanceiro() {
        return subsistemas.findByNomeIgnoreCase("Financeiro")
                .orElseThrow(() -> new NaoEncontradoException("O Subsistema Financeiro não foi inicializado."));
    }

    /** Valida vínculo atual→destino, perfil e situação; o índice único continua sendo a proteção final. */
    public void validarAlteracao(Usuario usuario, Perfil perfilDestino, Subsistema destino, boolean ativoDestino) {
        Subsistema financeiro = subsistemaFinanceiro();
        Long financeiroId = financeiro.getId();
        Long origemId = usuario.getSubsistema() == null ? null : usuario.getSubsistema().getId();
        Long destinoId = destino == null ? null : destino.getId();
        boolean envolveFinanceiro = financeiroId.equals(origemId) || financeiroId.equals(destinoId);
        if (!envolveFinanceiro) {
            return;
        }

        subsistemas.travar(financeiroId).orElseThrow(GestorFinanceiroService::financeiroNaoEncontrado);
        if (ativoDestino && perfilDestino == Perfil.GESTOR && financeiroId.equals(destinoId)
                && usuarios.existeOutroGestorFinanceiroAtivo(usuario.getId(), Perfil.GESTOR, financeiroId)) {
            throw new ConflitoException("O Subsistema Financeiro já tem um Gestor ativo.");
        }
    }

    /** Valida o novo Gestor antes de persistir a conta. */
    public void validarNovo(Perfil perfil, Subsistema destino, boolean ativo) {
        Subsistema financeiro = subsistemaFinanceiro();
        if (destino == null || !financeiro.getId().equals(destino.getId())) {
            return;
        }
        subsistemas.travar(financeiro.getId()).orElseThrow(GestorFinanceiroService::financeiroNaoEncontrado);
        if (ativo && perfil == Perfil.GESTOR
                && usuarios.buscarGestorFinanceiroAtivo(Perfil.GESTOR, financeiro.getId()).isPresent()) {
            throw new ConflitoException("O Subsistema Financeiro já tem um Gestor ativo.");
        }
    }

    /** Valida em conjunto operações que transferem vários usuários, antes de alterar qualquer um deles. */
    public void validarTransferencias(Map<Usuario, Subsistema> transferencias) {
        Subsistema financeiro = subsistemaFinanceiro();
        Long financeiroId = financeiro.getId();
        long gestoresAtivosTransferidos = transferencias.entrySet().stream()
                .filter(transferencia -> transferencia.getKey().isAtivo())
                .filter(transferencia -> transferencia.getKey().getPerfil() == Perfil.GESTOR)
                .filter(transferencia -> transferencia.getValue() != null)
                .filter(transferencia -> financeiroId.equals(transferencia.getValue().getId()))
                .count();
        if (gestoresAtivosTransferidos == 0) {
            return;
        }

        subsistemas.travar(financeiroId).orElseThrow(GestorFinanceiroService::financeiroNaoEncontrado);
        boolean gestorJaAssociado = usuarios.buscarGestorFinanceiroAtivo(Perfil.GESTOR, financeiroId).isPresent();
        if (gestoresAtivosTransferidos + (gestorJaAssociado ? 1 : 0) > 1) {
            throw new ConflitoException("O Subsistema Financeiro já tem um Gestor ativo.");
        }
    }

    private static NaoEncontradoException financeiroNaoEncontrado() {
        return new NaoEncontradoException("O Subsistema Financeiro não foi inicializado.");
    }
}
