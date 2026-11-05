package com.procobajaerp.backend.equipe.service;

import static com.procobajaerp.backend.auditoria.service.AuditoriaService.detalhes;

import java.text.Collator;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.auditoria.service.AuditoriaService;
import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.domain.Visibilidade;
import com.procobajaerp.backend.equipe.dto.DadosDeSubsistemaRequisicao;
import com.procobajaerp.backend.equipe.dto.SubsistemaResposta;
import com.procobajaerp.backend.equipe.dto.UsuarioResposta;
import com.procobajaerp.backend.equipe.repository.PerfilRepository;
import com.procobajaerp.backend.equipe.repository.SubsistemaRepository;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.shared.AcessoNegadoException;
import com.procobajaerp.backend.shared.ConflitoException;
import com.procobajaerp.backend.shared.NaoEncontradoException;
import com.procobajaerp.backend.shared.RegraDeNegocioException;

/**
 * Subsistemas, Definição de Líder e Transferência de integrante. O banco exige que o Líder seja Integrante do
 * próprio Subsistema, então a ordem em que Usuário e Subsistema chegam ao banco importa: veja os flush abaixo.
 */
@Service
@Transactional
public class SubsistemaService {

    private static final Collator COLLATOR = Collator.getInstance(Locale.of("pt", "BR"));

    private final SubsistemaRepository subsistemas;
    private final UsuarioRepository usuarios;
    private final PerfilRepository perfis;
    private final AuditoriaService auditoria;

    public SubsistemaService(SubsistemaRepository subsistemas, UsuarioRepository usuarios, PerfilRepository perfis,
            AuditoriaService auditoria) {
        this.subsistemas = subsistemas;
        this.usuarios = usuarios;
        this.perfis = perfis;
        this.auditoria = auditoria;
    }

    /** Nomes e Líderes dos Subsistemas ativos são de todos; os desativados aparecem só para Capitão e Gestor. */
    @Transactional(readOnly = true)
    public List<SubsistemaResposta> listar(Long atorId) {
        Usuario ator = usuario(atorId);
        return subsistemas.listarComLider().stream()
                .filter(s -> Visibilidade.podeVer(ator, s))
                .sorted(Comparator.comparing(Subsistema::getNome, COLLATOR))
                .map(SubsistemaResposta::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public SubsistemaResposta buscar(Long atorId, Long id) {
        return SubsistemaResposta.de(visivel(usuario(atorId), id));
    }

    /** Composição: Líder e Membro só veem a do próprio Subsistema. */
    @Transactional(readOnly = true)
    public List<UsuarioResposta> integrantes(Long atorId, Long id) {
        Usuario ator = usuario(atorId);
        Subsistema subsistema = visivel(ator, id);
        if (!Visibilidade.podeVerComposicao(ator, subsistema)) {
            throw new AcessoNegadoException("Seu Perfil só vê a Composição do próprio Subsistema.");
        }
        return usuarios.listarDoSubsistema(subsistema).stream()
                .filter(u -> Visibilidade.podeVer(ator, u))
                .sorted(Comparator.comparing(Usuario::getNome, COLLATOR))
                .map(u -> UsuarioResposta.de(u, Visibilidade.podeVerRa(ator, u)))
                .toList();
    }

    /** Nasce desativado e sem Líder; já pode receber Integrantes e se ativa na primeira Definição de Líder. */
    public SubsistemaResposta criar(Long atorId, DadosDeSubsistemaRequisicao dados) {
        Usuario ator = administrador(atorId);
        String nome = dados.nome().strip();
        exigirNomeLivre(nome, null);
        Subsistema subsistema = subsistemas.save(new Subsistema(nome, descricao(dados)));
        auditoria.registrar(ator.getId(), Entidades.SUBSISTEMA, subsistema.getId(), "CRIADO", detalhes("nome", nome));
        return SubsistemaResposta.de(subsistema);
    }

    public SubsistemaResposta editar(Long atorId, Long id, DadosDeSubsistemaRequisicao dados) {
        Usuario ator = administrador(atorId);
        Subsistema subsistema = subsistema(id);
        String nome = dados.nome().strip();
        exigirNomeLivre(nome, subsistema);
        auditoria.registrar(ator.getId(), Entidades.SUBSISTEMA, id, "EDITADO", detalhes(
                "nomeAnterior", subsistema.getNome(), "nome", nome,
                "descricaoAnterior", subsistema.getDescricao(), "descricao", descricao(dados)));
        subsistema.editar(nome, descricao(dados));
        return SubsistemaResposta.de(subsistema);
    }

    /**
     * O escolhido, um Membro ativo, passa a Líder e é transferido se vier de outro Subsistema; o Líder anterior
     * volta a Membro no mesmo Subsistema. O Subsistema desativado se ativa.
     */
    public SubsistemaResposta definirLider(Long atorId, Long id, Long usuarioId) {
        Usuario ator = administrador(atorId);
        Subsistema subsistema = subsistema(id);
        Usuario novo = usuario(usuarioId);
        if (novo.getPerfil() != Perfil.MEMBRO || !novo.isAtivo()) {
            throw new RegraDeNegocioException("O Líder é escolhido entre os Membros ativos.");
        }
        if (!novo.pertenceA(subsistema)) {
            transferir(ator, novo, subsistema, null);
            // O Líder precisa estar no Subsistema antes de o Subsistema apontar para ele.
            usuarios.flush();
        }
        Usuario anterior = subsistema.getLider();
        if (anterior != null) {
            trocarPerfil(ator, anterior, Perfil.MEMBRO, "SUBSTITUIDO_NA_LIDERANCA");
        }
        trocarPerfil(ator, novo, Perfil.LIDER, "DEFINIDO_COMO_LIDER");
        boolean ativou = !subsistema.isAtivo();
        subsistema.definirLider(novo);
        auditoria.registrar(ator.getId(), Entidades.SUBSISTEMA, id, "LIDER_DEFINIDO",
                detalhes("liderAnteriorId", anterior == null ? null : anterior.getId(), "liderId", novo.getId()));
        if (ativou) {
            auditoria.registrar(ator.getId(), Entidades.SUBSISTEMA, id, "ATIVADO", detalhes());
        }
        return SubsistemaResposta.de(subsistema);
    }

    /**
     * Todos os Usuários do Subsistema, inclusive os desativados, vão para o destino, e o Líder vai como Membro.
     * Para reativar, basta uma nova Definição de Líder.
     */
    public SubsistemaResposta desativar(Long atorId, Long id, Long destinoId) {
        Usuario ator = administrador(atorId);
        Subsistema subsistema = subsistema(id);
        if (!subsistema.isAtivo()) {
            throw new RegraDeNegocioException("O Subsistema já está desativado.");
        }
        List<Usuario> pessoas = usuarios.listarDoSubsistema(subsistema);
        Subsistema destino = destinoDaDesativacao(subsistema, destinoId, !pessoas.isEmpty());
        Usuario lider = subsistema.getLider();
        subsistema.desativar();
        // O Líder só pode sair depois que o Subsistema deixa de apontar para ele.
        subsistemas.flush();
        if (lider != null) {
            trocarPerfil(ator, lider, Perfil.MEMBRO, "SUBSISTEMA_DESATIVADO");
        }
        for (Usuario pessoa : pessoas) {
            transferir(ator, pessoa, destino, "SUBSISTEMA_DESATIVADO");
        }
        auditoria.registrar(ator.getId(), Entidades.SUBSISTEMA, id, "DESATIVADO", detalhes(
                "destinoSubsistemaId", destino == null ? null : destino.getId(), "usuariosTransferidos", pessoas.size()));
        return SubsistemaResposta.de(subsistema);
    }

    /** Transferência de integrante para este Subsistema. O Líder precisa ser substituído antes. */
    public UsuarioResposta receberIntegrante(Long atorId, Long id, Long usuarioId) {
        Usuario ator = administrador(atorId);
        Subsistema subsistema = subsistema(id);
        Usuario alvo = usuario(usuarioId);
        ator.exigirQueAdministre(alvo.getPerfil());
        if (!alvo.getPerfil().admiteSubsistema()) {
            throw new RegraDeNegocioException("O Capitão não pertence a nenhum Subsistema.");
        }
        if (alvo.getPerfil() == Perfil.LIDER) {
            throw new RegraDeNegocioException("Defina outro Líder para o Subsistema antes de transferir o atual.");
        }
        if (alvo.pertenceA(subsistema)) {
            throw new RegraDeNegocioException(alvo.getNome() + " já está neste Subsistema.");
        }
        transferir(ator, alvo, subsistema, null);
        return UsuarioResposta.de(alvo, true);
    }

    /** Só o Orientador pode ficar sem Subsistema; os demais são transferidos para outro. */
    public UsuarioResposta retirarIntegrante(Long atorId, Long id, Long usuarioId) {
        Usuario ator = administrador(atorId);
        Subsistema subsistema = subsistema(id);
        Usuario alvo = usuario(usuarioId);
        ator.exigirQueAdministre(alvo.getPerfil());
        if (!alvo.pertenceA(subsistema)) {
            throw new NaoEncontradoException(alvo.getNome() + " não está neste Subsistema.");
        }
        if (alvo.getPerfil() != Perfil.ORIENTADOR) {
            throw new RegraDeNegocioException("Só o Orientador pode ficar sem Subsistema. Transfira o Usuário para outro.");
        }
        transferir(ator, alvo, null, null);
        return UsuarioResposta.de(alvo, true);
    }

    private void transferir(Usuario ator, Usuario alvo, Subsistema destino, String motivo) {
        Long origemId = alvo.getSubsistema() == null ? null : alvo.getSubsistema().getId();
        alvo.transferirPara(destino);
        auditoria.registrar(ator.getId(), Entidades.USUARIO, alvo.getId(), "TRANSFERIDO", detalhes(
                "subsistemaOrigemId", origemId, "subsistemaDestinoId", destino == null ? null : destino.getId(),
                "motivo", motivo));
    }

    private void trocarPerfil(Usuario ator, Usuario alvo, Perfil novo, String motivo) {
        Perfil anterior = alvo.getPerfil();
        alvo.trocarPerfil(perfis.findByNome(novo).orElseThrow());
        auditoria.registrar(ator.getId(), Entidades.USUARIO, alvo.getId(), "PERFIL_ALTERADO",
                detalhes("perfilAnterior", anterior, "perfil", novo, "motivo", motivo));
    }

    private Subsistema destinoDaDesativacao(Subsistema subsistema, Long destinoId, boolean temUsuarios) {
        if (!temUsuarios) {
            return null;
        }
        if (destinoId == null) {
            throw new RegraDeNegocioException("Informe o Subsistema que vai receber os Usuários deste.");
        }
        Subsistema destino = subsistema(destinoId);
        if (destino.getId().equals(subsistema.getId())) {
            throw new RegraDeNegocioException("O destino precisa ser outro Subsistema.");
        }
        if (!destino.isAtivo()) {
            throw new RegraDeNegocioException("O destino precisa ser um Subsistema ativo.");
        }
        return destino;
    }

    private void exigirNomeLivre(String nome, Subsistema proprio) {
        subsistemas.findByNomeIgnoreCase(nome)
                .filter(outro -> proprio == null || !outro.getId().equals(proprio.getId()))
                .ifPresent(outro -> {
                    throw new ConflitoException("Já existe um Subsistema chamado " + outro.getNome() + ".");
                });
    }

    private static String descricao(DadosDeSubsistemaRequisicao dados) {
        return dados.descricao() == null || dados.descricao().isBlank() ? null : dados.descricao().strip();
    }

    private Subsistema visivel(Usuario ator, Long id) {
        Subsistema subsistema = subsistema(id);
        if (!Visibilidade.podeVer(ator, subsistema)) {
            throw new NaoEncontradoException("Subsistema não encontrado.");
        }
        return subsistema;
    }

    /** Capitão e Gestor administram os Subsistemas. */
    private Usuario administrador(Long atorId) {
        Usuario ator = usuario(atorId);
        if (!ator.getPerfil().administraEquipe()) {
            throw new AcessoNegadoException("Só o Capitão e os Gestores administram Subsistemas.");
        }
        return ator;
    }

    private Subsistema subsistema(Long id) {
        return subsistemas.findById(id).orElseThrow(() -> new NaoEncontradoException("Subsistema não encontrado."));
    }

    private Usuario usuario(Long id) {
        return usuarios.findById(id).orElseThrow(() -> new NaoEncontradoException("Usuário não encontrado."));
    }
}
