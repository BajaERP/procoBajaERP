package com.procobajaerp.backend.auditoria.service;

import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.auditoria.domain.RegistroDeAuditoria;
import com.procobajaerp.backend.auditoria.dto.ConsultaAuditoriaResposta;
import com.procobajaerp.backend.auditoria.dto.EventoAuditoriaResposta;
import com.procobajaerp.backend.auditoria.repository.RegistroDeAuditoriaRepository;
import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.dto.Resumo;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.shared.AcessoNegadoException;
import com.procobajaerp.backend.shared.NaoEncontradoException;

@Service
public class ConsultaAuditoriaService {

    private final RegistroDeAuditoriaRepository registros;
    private final UsuarioRepository usuarios;

    public ConsultaAuditoriaService(RegistroDeAuditoriaRepository registros, UsuarioRepository usuarios) {
        this.registros = registros;
        this.usuarios = usuarios;
    }

    @Transactional(readOnly = true)
    public ConsultaAuditoriaResposta consultar(Long atorId, int page, int size, String entidade, String acao) {
        Usuario ator = usuarios.buscarCompleto(atorId).orElseThrow(ConsultaAuditoriaService::usuarioNaoEncontrado);
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("registradoEm"), Sort.Order.desc("id")));
        Page<RegistroDeAuditoria> resultado;
        if (ator.getPerfil() == Perfil.CAPITAO_ADMIN || ator.getPerfil() == Perfil.GESTOR) {
            resultado = registros.listarTodos(normalizar(entidade), normalizar(acao), pageable);
        } else if (ator.getPerfil() == Perfil.LIDER && ator.getSubsistema() != null) {
            resultado = registros.listarDoSubsistema(ator.getSubsistema().getId(),
                    normalizar(entidade), normalizar(acao), pageable);
        } else {
            throw new AcessoNegadoException("Seu Perfil não pode consultar o histórico de auditoria.");
        }
        return new ConsultaAuditoriaResposta(
                resultado.getContent().stream().map(ConsultaAuditoriaService::resposta).toList(),
                resultado.getNumber(), resultado.getSize(), resultado.getTotalElements(), resultado.getTotalPages());
    }

    private static EventoAuditoriaResposta resposta(RegistroDeAuditoria registro) {
        return new EventoAuditoriaResposta(
                registro.getId(), registro.getRegistradoEm(),
                registro.getAtor() == null ? "Sistema" : registro.getAtor().getNome(),
                registro.getEntidade(), registro.getAcao(), descricao(registro.getEntidade(), registro.getAcao()),
                Resumo.de(registro.getSubsistemaOrigem()), Resumo.de(registro.getSubsistemaDestino()));
    }

    private static String descricao(String entidade, String acao) {
        if ("USUARIO".equals(entidade)) {
            return switch (acao) {
                case "CADASTRADO" -> "Integrante cadastrado";
                case "EDITADO" -> "Dados do integrante atualizados";
                case "PERFIL_ALTERADO" -> "Perfil do integrante alterado";
                case "DESATIVADO" -> "Integrante desativado";
                case "REATIVADO" -> "Integrante reativado";
                case "SENHA_REDEFINIDA" -> "Senha provisória redefinida";
                case "TRANSFERIDO" -> "Integrante transferido entre subsistemas";
                default -> "Alteração de integrante registrada";
            };
        }
        if ("SUBSISTEMA".equals(entidade)) {
            return switch (acao) {
                case "CRIADO" -> "Subsistema criado";
                case "EDITADO" -> "Dados do subsistema atualizados";
                case "LIDER_DEFINIDO" -> "Liderança do subsistema atualizada";
                case "ATIVADO" -> "Subsistema ativado";
                case "DESATIVADO" -> "Subsistema desativado";
                default -> "Alteração de subsistema registrada";
            };
        }
        return "Alteração registrada";
    }

    private static String normalizar(String valor) {
        return valor == null || valor.isBlank() ? "" : valor.strip().toUpperCase(Locale.ROOT);
    }

    private static NaoEncontradoException usuarioNaoEncontrado() {
        return new NaoEncontradoException("Usuário não encontrado.");
    }
}
