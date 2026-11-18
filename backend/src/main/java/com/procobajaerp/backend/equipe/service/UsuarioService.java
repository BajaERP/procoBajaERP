package com.procobajaerp.backend.equipe.service;

import static com.procobajaerp.backend.auditoria.service.AuditoriaService.detalhes;

import java.text.Collator;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.auditoria.service.AuditoriaService;
import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.PerfilEntidade;
import com.procobajaerp.backend.equipe.domain.Ra;
import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.domain.Visibilidade;
import com.procobajaerp.backend.equipe.dto.CadastroDeUsuarioRequisicao;
import com.procobajaerp.backend.equipe.dto.EdicaoDeUsuarioRequisicao;
import com.procobajaerp.backend.equipe.dto.Resumo;
import com.procobajaerp.backend.equipe.dto.SenhaProvisoriaResposta;
import com.procobajaerp.backend.equipe.dto.TrocaDePerfilRequisicao;
import com.procobajaerp.backend.equipe.dto.UsuarioCadastradoResposta;
import com.procobajaerp.backend.equipe.dto.UsuarioResposta;
import com.procobajaerp.backend.equipe.repository.PerfilRepository;
import com.procobajaerp.backend.equipe.repository.SubsistemaRepository;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.shared.ConflitoException;
import com.procobajaerp.backend.shared.NaoEncontradoException;
import com.procobajaerp.backend.shared.RegraDeNegocioException;

/**
 * Cadastro e administração de Usuários. O Capitão administra todos os Perfis; o Gestor, só Líder, Membro e
 * Orientador. O Perfil Líder só muda pela Definição de Líder, no {@link SubsistemaService}.
 */
@Service
@Transactional
public class UsuarioService {

    private static final Comparator<Usuario> POR_NOME = Comparator.comparing(
            Usuario::getNome, Collator.getInstance(Locale.of("pt", "BR")));

    private final UsuarioRepository usuarios;
    private final PerfilRepository perfis;
    private final SubsistemaRepository subsistemas;
    private final AtribuicaoFinanceiraService atribuicaoFinanceira;
    private final AuditoriaService auditoria;
    private final PasswordEncoder codificador;
    private final GeradorDeSenhaProvisoria gerador;

    public UsuarioService(UsuarioRepository usuarios, PerfilRepository perfis, SubsistemaRepository subsistemas,
            AtribuicaoFinanceiraService atribuicaoFinanceira, AuditoriaService auditoria, PasswordEncoder codificador,
            GeradorDeSenhaProvisoria gerador) {
        this.usuarios = usuarios;
        this.perfis = perfis;
        this.subsistemas = subsistemas;
        this.atribuicaoFinanceira = atribuicaoFinanceira;
        this.auditoria = auditoria;
        this.codificador = codificador;
        this.gerador = gerador;
    }

    @Transactional(readOnly = true)
    public List<UsuarioResposta> listar(Long atorId, Long subsistemaId, Perfil perfil, Boolean ativo) {
        Usuario ator = usuario(atorId);
        return usuarios.listarCompletos().stream()
                .filter(u -> Visibilidade.podeVer(ator, u))
                .filter(u -> subsistemaId == null || (u.getSubsistema() != null && u.getSubsistema().getId().equals(subsistemaId)))
                .filter(u -> perfil == null || u.getPerfil() == perfil)
                .filter(u -> ativo == null || u.isAtivo() == ativo)
                .sorted(POR_NOME)
                .map(u -> UsuarioResposta.de(u, Visibilidade.podeVerRa(ator, u)))
                .toList();
    }

    @Transactional(readOnly = true)
    public UsuarioResposta buscar(Long atorId, Long id) {
        Usuario ator = usuario(atorId);
        Usuario alvo = usuario(id);
        if (!Visibilidade.podeVer(ator, alvo)) {
            throw naoEncontrado();
        }
        return UsuarioResposta.de(alvo, Visibilidade.podeVerRa(ator, alvo));
    }

    /**
     * Cadastra com uma Senha provisória, devolvida só nesta resposta. A responsabilidade financeira não vem no
     * cadastro: o Capitão a atribui depois a um Gestor ativo.
     */
    public UsuarioCadastradoResposta cadastrar(Long atorId, CadastroDeUsuarioRequisicao dados) {
        Usuario ator = usuario(atorId);
        Perfil perfil = dados.perfil();
        ator.exigirQueAdministre(perfil);
        if (perfil == Perfil.LIDER) {
            throw new RegraDeNegocioException(
                    "Ninguém é cadastrado como Líder: cadastre como Membro e faça a Definição de Líder no Subsistema.");
        }
        String ra = Ra.validar(dados.ra());
        usuarios.findByRa(ra).ifPresent(existente -> {
            throw raEmUso(existente);
        });
        Subsistema subsistema = subsistemaDoCadastro(perfil, dados.subsistemaId());

        String senha = gerador.gerar();
        Usuario novo = usuarios.save(new Usuario(ra, dados.nome().strip(), codificador.encode(senha),
                perfilEntidade(perfil), subsistema, true));
        auditoria.registrar(ator.getId(), Entidades.USUARIO, novo.getId(), "CADASTRADO", detalhes(
                "perfil", perfil, "subsistemaId", subsistema == null ? null : subsistema.getId(), "ativo", novo.isAtivo()));
        return new UsuarioCadastradoResposta(UsuarioResposta.de(novo, true), senha);
    }

    /** Corrige Nome e RA. Ninguém corrige os próprios: o próprio Usuário só muda a senha. */
    public UsuarioResposta editar(Long atorId, Long id, EdicaoDeUsuarioRequisicao dados) {
        Usuario ator = usuario(atorId);
        Usuario alvo = usuario(id);
        exigirOutroUsuario(ator, alvo, "Você não pode corrigir o próprio Nome ou RA. Peça ao Capitão ou a um Gestor.");
        ator.exigirQueAdministre(alvo.getPerfil());
        String nome = dados.nome().strip();
        String ra = Ra.validar(dados.ra());
        if (!ra.equals(alvo.getRa()) && usuarios.existsByRa(ra)) {
            throw new ConflitoException("Este RA já está em uso por outro Usuário.");
        }
        if (nome.equals(alvo.getNome()) && ra.equals(alvo.getRa())) {
            return UsuarioResposta.de(alvo, true);
        }
        auditoria.registrar(ator.getId(), Entidades.USUARIO, alvo.getId(), "EDITADO",
                detalhes("nomeAnterior", alvo.getNome(), "nome", nome, "raAnterior", alvo.getRa(), "ra", ra));
        alvo.corrigir(nome, ra);
        return UsuarioResposta.de(alvo, true);
    }

    public UsuarioResposta trocarPerfil(Long atorId, Long id, TrocaDePerfilRequisicao dados) {
        Usuario ator = usuario(atorId);
        Usuario alvo = usuarios.travar(id).orElseThrow(UsuarioService::naoEncontrado);
        exigirOutroUsuario(ator, alvo, "Você não pode trocar o próprio Perfil.");
        Perfil atual = alvo.getPerfil();
        Perfil novo = dados.perfil();
        ator.exigirQueAdministre(atual);
        ator.exigirQueAdministre(novo);
        if (atual == novo) {
            throw new RegraDeNegocioException("O Usuário já tem o Perfil " + novo.rotulo() + ".");
        }
        if (atual == Perfil.LIDER || novo == Perfil.LIDER) {
            throw new RegraDeNegocioException("O Perfil Líder só muda pela Definição de Líder do Subsistema.");
        }
        if (atual == Perfil.CAPITAO_ADMIN && alvo.isAtivo()) {
            exigirOutroCapitaoAtivo();
        }
        atribuicaoFinanceira.exigirQueNaoSejaGestorFinanceiro(alvo, "trocar de Perfil");
        Subsistema subsistema = subsistemaDaTroca(alvo, novo, dados.subsistemaId());

        Long subsistemaAnteriorId = alvo.getSubsistema() == null ? null : alvo.getSubsistema().getId();
        alvo.trocarPerfil(perfilEntidade(novo));
        alvo.transferirPara(subsistema);
        auditoria.registrar(ator.getId(), Entidades.USUARIO, alvo.getId(), "PERFIL_ALTERADO", detalhes(
                "perfilAnterior", atual, "perfil", novo,
                "subsistemaAnteriorId", subsistemaAnteriorId, "subsistemaId", subsistema == null ? null : subsistema.getId()));
        return UsuarioResposta.de(alvo, true);
    }

    public UsuarioResposta desativar(Long atorId, Long id) {
        Usuario ator = usuario(atorId);
        Usuario alvo = usuarios.travar(id).orElseThrow(UsuarioService::naoEncontrado);
        exigirOutroUsuario(ator, alvo, "Você não pode desativar a si mesmo.");
        ator.exigirQueAdministre(alvo.getPerfil());
        if (!alvo.isAtivo()) {
            throw new RegraDeNegocioException("O Usuário já está desativado.");
        }
        switch (alvo.getPerfil()) {
            case LIDER -> throw new RegraDeNegocioException(
                    "Defina outro Líder para o Subsistema antes de desativar o atual.");
            case CAPITAO_ADMIN -> exigirOutroCapitaoAtivo();
            case GESTOR -> atribuicaoFinanceira.exigirQueNaoSejaGestorFinanceiro(alvo, "ser desativado");
            default -> {
            }
        }
        alvo.desativar();
        auditoria.registrar(ator.getId(), Entidades.USUARIO, alvo.getId(), "DESATIVADO", Map.of());
        return UsuarioResposta.de(alvo, true);
    }

    public UsuarioResposta reativar(Long atorId, Long id) {
        Usuario ator = usuario(atorId);
        Usuario alvo = usuario(id);
        ator.exigirQueAdministre(alvo.getPerfil());
        if (alvo.isAtivo()) {
            throw new RegraDeNegocioException("O Usuário já está ativo.");
        }
        alvo.reativar();
        auditoria.registrar(ator.getId(), Entidades.USUARIO, alvo.getId(), "REATIVADO", Map.of());
        return UsuarioResposta.de(alvo, true);
    }

    public SenhaProvisoriaResposta redefinirSenha(Long atorId, Long id) {
        Usuario ator = usuario(atorId);
        Usuario alvo = usuario(id);
        exigirOutroUsuario(ator, alvo, "Para mudar a própria senha, use a troca de senha da sua conta.");
        ator.exigirQueAdministre(alvo.getPerfil());
        String senha = gerador.gerar();
        alvo.redefinirSenha(codificador.encode(senha));
        auditoria.registrar(ator.getId(), Entidades.USUARIO, alvo.getId(), "SENHA_REDEFINIDA", Map.of());
        return new SenhaProvisoriaResposta(senha);
    }

    private ConflitoException raEmUso(Usuario existente) {
        if (existente.isAtivo()) {
            return new ConflitoException("Este RA já está em uso por outro Usuário.");
        }
        return new ConflitoException("Este RA pertence a um Usuário desativado. Reative-o em vez de cadastrar outro.",
                Map.of("usuarioDesativado", Resumo.de(existente)));
    }

    private Subsistema subsistemaDoCadastro(Perfil perfil, Long subsistemaId) {
        if (!perfil.admiteSubsistema()) {
            if (subsistemaId != null) {
                throw new RegraDeNegocioException("O Capitão não pertence a nenhum Subsistema.");
            }
            return null;
        }
        if (subsistemaId == null) {
            if (perfil.exigeSubsistema()) {
                throw new RegraDeNegocioException("Informe o Subsistema do novo Usuário.");
            }
            return null;
        }
        return subsistema(subsistemaId);
    }

    /**
     * Quem passa a Capitão sai do Subsistema. Quem não tem Subsistema e passa a um Perfil que exige informa um.
     * Quem já tem continua nele: mudar de Subsistema é uma Transferência de integrante.
     */
    private Subsistema subsistemaDaTroca(Usuario alvo, Perfil novo, Long subsistemaId) {
        Subsistema atual = alvo.getSubsistema();
        if (!novo.admiteSubsistema()) {
            if (subsistemaId != null) {
                throw new RegraDeNegocioException("O Capitão não pertence a nenhum Subsistema.");
            }
            return null;
        }
        if (atual != null) {
            if (subsistemaId != null && !subsistemaId.equals(atual.getId())) {
                throw new RegraDeNegocioException("Para mudar de Subsistema, faça a Transferência de integrante.");
            }
            return atual;
        }
        if (subsistemaId != null) {
            return subsistema(subsistemaId);
        }
        if (novo.exigeSubsistema()) {
            throw new RegraDeNegocioException("Informe o Subsistema: o Perfil " + novo.rotulo() + " exige um.");
        }
        return null;
    }

    private void exigirOutroCapitaoAtivo() {
        if (usuarios.countByPerfilNomeAndAtivoTrue(Perfil.CAPITAO_ADMIN) <= 1) {
            throw new RegraDeNegocioException("A equipe precisa de pelo menos um Capitão ativo.");
        }
    }

    private static void exigirOutroUsuario(Usuario ator, Usuario alvo, String mensagem) {
        if (ator.mesmoUsuario(alvo)) {
            throw new RegraDeNegocioException(mensagem);
        }
    }

    private PerfilEntidade perfilEntidade(Perfil perfil) {
        return perfis.findByNome(perfil).orElseThrow();
    }

    private Subsistema subsistema(Long id) {
        return subsistemas.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new NaoEncontradoException("Subsistema não encontrado."));
    }

    private Usuario usuario(Long id) {
        return usuarios.findById(id).orElseThrow(UsuarioService::naoEncontrado);
    }

    private static NaoEncontradoException naoEncontrado() {
        return new NaoEncontradoException("Usuário não encontrado.");
    }
}
