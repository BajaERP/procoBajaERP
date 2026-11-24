package com.procobajaerp.backend.equipe.service;

import static com.procobajaerp.backend.auditoria.service.AuditoriaService.detalhes;

import java.text.Collator;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.auditoria.service.AuditoriaService;
import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.domain.Visibilidade;
import com.procobajaerp.backend.equipe.dto.DadosDeSubsistemaRequisicao;
import com.procobajaerp.backend.equipe.dto.DesativacaoDeSubsistemaRequisicao.Destino;
import com.procobajaerp.backend.equipe.dto.Resumo;
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
    private final GestorFinanceiroService gestorFinanceiro;

    public SubsistemaService(SubsistemaRepository subsistemas, UsuarioRepository usuarios, PerfilRepository perfis,
            AuditoriaService auditoria, GestorFinanceiroService gestorFinanceiro) {
        this.subsistemas = subsistemas;
        this.usuarios = usuarios;
        this.perfis = perfis;
        this.auditoria = auditoria;
        this.gestorFinanceiro = gestorFinanceiro;
    }

    /** Nomes e Líderes dos Subsistemas ativos são de todos; os desativados, de Capitão, Gestor e de quem pertence a ele. */
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
        if (ehFinanceiro(subsistema) && !"Financeiro".equals(nome)) {
            throw new RegraDeNegocioException("O Subsistema Financeiro é permanente e não pode ser renomeado.");
        }
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
     * Cada Usuário do Subsistema, inclusive os desativados, vai para o Subsistema ativo escolhido para ele, e o Líder vai
     * como Membro. Sem outro Subsistema ativo, só um Subsistema vazio pode ser desativado. Tudo é validado antes de
     * qualquer mudança. Para reativar, basta uma nova Definição de Líder.
     */
    public SubsistemaResposta desativar(Long atorId, Long id, List<Destino> destinosInformados) {
        Usuario ator = capitao(atorId);
        Subsistema subsistema = subsistema(id);
        if (!subsistema.isAtivo()) {
            throw new RegraDeNegocioException("O Subsistema já está desativado.");
        }
        if (ehFinanceiro(subsistema)) {
            throw new RegraDeNegocioException("O Subsistema Financeiro é permanente e não pode ser desativado.");
        }
        List<Usuario> pessoas = usuarios.listarDoSubsistema(subsistema);
        Map<Usuario, Subsistema> destinos = destinosDaDesativacao(subsistema, pessoas, destinosInformados);
        gestorFinanceiro.validarTransferencias(destinos);
        Usuario lider = subsistema.getLider();
        subsistema.desativar();
        // O Líder só pode sair depois que o Subsistema deixa de apontar para ele.
        subsistemas.flush();
        if (lider != null) {
            trocarPerfil(ator, lider, Perfil.MEMBRO, "SUBSISTEMA_DESATIVADO");
        }
        destinos.forEach((pessoa, destino) -> transferir(ator, pessoa, destino, "SUBSISTEMA_DESATIVADO"));
        auditoria.registrar(ator.getId(), Entidades.SUBSISTEMA, id, "DESATIVADO", detalhes(
                "usuariosTransferidos", pessoas.size(),
                "destinos", destinos.entrySet().stream()
                        .map(d -> Map.of("usuarioId", d.getKey().getId(), "subsistemaId", d.getValue().getId()))
                        .toList()));
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
        gestorFinanceiro.validarAlteracao(alvo, alvo.getPerfil(), destino, alvo.isAtivo());
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

    /** Exige exatamente um destino ativo, diferente da origem, para cada Usuário do Subsistema e para nenhum outro. */
    private Map<Usuario, Subsistema> destinosDaDesativacao(Subsistema origem, List<Usuario> pessoas,
            List<Destino> informados) {
        if (!pessoas.isEmpty() && !subsistemas.existsByAtivoTrueAndIdNot(origem.getId())) {
            throw new RegraDeNegocioException("Não há outro Subsistema ativo para receber os Usuários deste. "
                    + "Ative outro Subsistema, definindo seu Líder, antes de desativar este.");
        }
        Map<Long, Usuario> porId = new LinkedHashMap<>();
        pessoas.stream().sorted(Comparator.comparing(Usuario::getNome, COLLATOR)).forEach(u -> porId.put(u.getId(), u));
        Map<Long, Subsistema> destinoPorUsuario = new LinkedHashMap<>();
        for (Destino informado : informados) {
            Usuario pessoa = porId.get(informado.usuarioId());
            if (pessoa == null) {
                throw new NaoEncontradoException("Usuário " + informado.usuarioId() + " não encontrado neste Subsistema.");
            }
            Subsistema destino = subsistema(informado.subsistemaId());
            if (destino.getId().equals(origem.getId())) {
                throw new RegraDeNegocioException("O destino de " + pessoa.getNome() + " precisa ser outro Subsistema.");
            }
            if (!destino.isAtivo()) {
                throw new RegraDeNegocioException("O destino de " + pessoa.getNome() + " precisa ser um Subsistema ativo.");
            }
            if (destinoPorUsuario.put(pessoa.getId(), destino) != null) {
                throw new RegraDeNegocioException("Informe um só destino para " + pessoa.getNome() + ".");
            }
        }
        List<Resumo> semDestino = porId.values().stream()
                .filter(u -> !destinoPorUsuario.containsKey(u.getId()))
                .map(Resumo::de)
                .toList();
        if (!semDestino.isEmpty()) {
            throw new RegraDeNegocioException("Escolha um Subsistema ativo para cada Usuário deste, inclusive os desativados.",
                    Map.of("semDestino", semDestino));
        }
        Map<Usuario, Subsistema> destinos = new LinkedHashMap<>();
        porId.forEach((usuarioId, pessoa) -> destinos.put(pessoa, destinoPorUsuario.get(usuarioId)));
        return destinos;
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

    private Usuario capitao(Long atorId) {
        Usuario ator = usuario(atorId);
        if (ator.getPerfil() != Perfil.CAPITAO_ADMIN) {
            throw new AcessoNegadoException("Só o Capitão pode desativar Subsistemas.");
        }
        return ator;
    }

    private Subsistema subsistema(Long id) {
        return subsistemas.findById(id).orElseThrow(() -> new NaoEncontradoException("Subsistema não encontrado."));
    }

    private static boolean ehFinanceiro(Subsistema subsistema) {
        return "Financeiro".equalsIgnoreCase(subsistema.getNome());
    }

    private Usuario usuario(Long id) {
        return usuarios.findById(id).orElseThrow(() -> new NaoEncontradoException("Usuário não encontrado."));
    }
}
