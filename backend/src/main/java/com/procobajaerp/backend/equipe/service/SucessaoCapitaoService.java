package com.procobajaerp.backend.equipe.service;

import static com.procobajaerp.backend.auditoria.service.AuditoriaService.detalhes;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.auditoria.service.AuditoriaService;
import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.PerfilEntidade;
import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.dto.Resumo;
import com.procobajaerp.backend.equipe.dto.SucessaoCapitaoRequisicao;
import com.procobajaerp.backend.equipe.dto.SucessaoCapitaoResposta;
import com.procobajaerp.backend.equipe.dto.UsuarioResposta;
import com.procobajaerp.backend.equipe.repository.PerfilRepository;
import com.procobajaerp.backend.equipe.repository.SubsistemaRepository;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.shared.AcessoNegadoException;
import com.procobajaerp.backend.shared.NaoEncontradoException;
import com.procobajaerp.backend.shared.RegraDeNegocioException;

/** Transfere atomicamente o Perfil Capitão e associa o Capitão anterior a um Subsistema como Membro. */
@Service
@Transactional
public class SucessaoCapitaoService {

    private final UsuarioRepository usuarios;
    private final PerfilRepository perfis;
    private final SubsistemaRepository subsistemas;
    private final AuditoriaService auditoria;

    public SucessaoCapitaoService(UsuarioRepository usuarios, PerfilRepository perfis,
            SubsistemaRepository subsistemas, AuditoriaService auditoria) {
        this.usuarios = usuarios;
        this.perfis = perfis;
        this.subsistemas = subsistemas;
        this.auditoria = auditoria;
    }

    public SucessaoCapitaoResposta suceder(Long capitaoId, SucessaoCapitaoRequisicao dados) {
        Usuario capitao = capitaoAtivo(capitaoId);
        if (capitaoId.equals(dados.sucessorId())) {
            throw new RegraDeNegocioException("Escolha outra pessoa como próximo Capitão.");
        }

        Usuario sucessor = usuarios.travar(dados.sucessorId()).orElseThrow(SucessaoCapitaoService::usuarioNaoEncontrado);
        if (!sucessor.isAtivo()
                || (sucessor.getPerfil() != Perfil.GESTOR && sucessor.getPerfil() != Perfil.MEMBRO)) {
            throw new RegraDeNegocioException("O próximo Capitão precisa ser um Gestor ou Membro ativo.");
        }
        Subsistema destino = subsistemas.travar(dados.subsistemaDestinoId())
                .orElseThrow(() -> new NaoEncontradoException("Subsistema não encontrado."));
        if (!destino.isAtivo()) {
            throw new RegraDeNegocioException("Escolha um Subsistema ativo para o Capitão atual.");
        }

        Perfil perfilAnterior = sucessor.getPerfil();
        Long subsistemaAnteriorId = sucessor.getSubsistema() == null ? null : sucessor.getSubsistema().getId();

        capitao.trocarPerfil(perfil(Perfil.MEMBRO));
        capitao.transferirPara(destino);
        // O índice único só admite um Capitão ativo; liberar a linha antes de promover o sucessor.
        usuarios.flush();

        sucessor.trocarPerfil(perfil(Perfil.CAPITAO_ADMIN));
        sucessor.transferirPara(null);
        usuarios.flush();

        auditoria.registrar(capitao.getId(), Entidades.USUARIO, capitao.getId(), "PERFIL_ALTERADO",
                null, destino.getId(),
                detalhes("perfilAnterior", Perfil.CAPITAO_ADMIN, "perfil", Perfil.MEMBRO,
                        "motivo", "SUCESSAO_CAPITAO", "capitaoSucessorId", sucessor.getId()));
        auditoria.registrar(capitao.getId(), Entidades.USUARIO, capitao.getId(), "TRANSFERIDO",
                null, destino.getId(),
                detalhes("subsistemaOrigemId", null, "subsistemaDestinoId", destino.getId(),
                        "motivo", "SUCESSAO_CAPITAO"));
        auditoria.registrar(capitao.getId(), Entidades.USUARIO, sucessor.getId(), "PERFIL_ALTERADO",
                subsistemaAnteriorId, null,
                detalhes("perfilAnterior", perfilAnterior, "perfil", Perfil.CAPITAO_ADMIN,
                        "subsistemaAnteriorId", subsistemaAnteriorId, "motivo", "SUCESSAO_CAPITAO",
                        "capitaoAnteriorId", capitao.getId()));

        return new SucessaoCapitaoResposta(UsuarioResposta.de(capitao, true), UsuarioResposta.de(sucessor, true));
    }

    @Transactional(readOnly = true)
    public SucessaoCapitaoResposta.Opcoes opcoes(Long capitaoId) {
        Usuario capitao = usuarios.findById(capitaoId).orElseThrow(SucessaoCapitaoService::usuarioNaoEncontrado);
        if (!capitao.isAtivo() || capitao.getPerfil() != Perfil.CAPITAO_ADMIN) {
            throw new AcessoNegadoException("Só o Capitão ativo pode consultar as opções de sucessão.");
        }
        List<SucessaoCapitaoResposta.Candidato> sucessores = usuarios.listarCompletos().stream()
                .filter(Usuario::isAtivo)
                .filter(usuario -> usuario.getPerfil() == Perfil.GESTOR || usuario.getPerfil() == Perfil.MEMBRO)
                .sorted(Comparator.comparing(Usuario::getNome, String.CASE_INSENSITIVE_ORDER))
                .map(usuario -> new SucessaoCapitaoResposta.Candidato(usuario.getId(), usuario.getNome(),
                        usuario.getPerfil().name(), usuario.isGestorFinanceiro(), Resumo.de(usuario.getSubsistema())))
                .toList();
        List<Resumo> destinos = subsistemas.findByAtivoTrueOrderByNomeAsc().stream().map(Resumo::de).toList();
        return new SucessaoCapitaoResposta.Opcoes(sucessores, destinos);
    }

    private Usuario capitaoAtivo(Long capitaoId) {
        Usuario capitao = usuarios.travar(capitaoId).orElseThrow(SucessaoCapitaoService::usuarioNaoEncontrado);
        if (!capitao.isAtivo() || capitao.getPerfil() != Perfil.CAPITAO_ADMIN) {
            throw new AcessoNegadoException("Só o Capitão ativo pode iniciar a sucessão.");
        }
        return capitao;
    }

    private PerfilEntidade perfil(Perfil perfil) {
        return perfis.findByNome(perfil).orElseThrow();
    }

    private static NaoEncontradoException usuarioNaoEncontrado() {
        return new NaoEncontradoException("Usuário não encontrado.");
    }
}
