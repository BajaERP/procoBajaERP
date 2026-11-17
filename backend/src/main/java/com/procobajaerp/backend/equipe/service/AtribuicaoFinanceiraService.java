package com.procobajaerp.backend.equipe.service;

import static com.procobajaerp.backend.auditoria.service.AuditoriaService.detalhes;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.auditoria.service.AuditoriaService;
import com.procobajaerp.backend.equipe.domain.AtribuicaoFinanceira;
import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.dto.AtribuicaoFinanceiraResposta;
import com.procobajaerp.backend.equipe.repository.AtribuicaoFinanceiraRepository;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.shared.AcessoNegadoException;
import com.procobajaerp.backend.shared.NaoEncontradoException;
import com.procobajaerp.backend.shared.RegraDeNegocioException;

/**
 * Atribuição financeira: só o Capitão a dá, transfere ou retira, sempre a um Gestor ativo e a no máximo um por vez.
 * Quem pode ver a equipe vê quem é o Gestor Financeiro.
 */
@Service
@Transactional
public class AtribuicaoFinanceiraService {

    private final AtribuicaoFinanceiraRepository atribuicoes;
    private final UsuarioRepository usuarios;
    private final AuditoriaService auditoria;

    public AtribuicaoFinanceiraService(AtribuicaoFinanceiraRepository atribuicoes, UsuarioRepository usuarios,
            AuditoriaService auditoria) {
        this.atribuicoes = atribuicoes;
        this.usuarios = usuarios;
        this.auditoria = auditoria;
    }

    @Transactional(readOnly = true)
    public AtribuicaoFinanceiraResposta consultar() {
        return atribuicoes.buscarAtual().map(AtribuicaoFinanceiraResposta::de).orElse(AtribuicaoFinanceiraResposta.VAGA);
    }

    /**
     * Dá a responsabilidade ao Gestor ou a transfere para ele numa só operação; nunca há dois Gestores Financeiros.
     * O Subsistema do Gestor pode estar inativo.
     */
    public AtribuicaoFinanceiraResposta atribuir(Long atorId, Long gestorId) {
        Usuario capitao = capitao(atorId);
        atribuicoes.travar();
        Usuario gestor = usuarios.travar(gestorId).orElseThrow(AtribuicaoFinanceiraService::usuarioNaoEncontrado);
        if (gestor.getPerfil() != Perfil.GESTOR || !gestor.isAtivo()) {
            throw new RegraDeNegocioException("A responsabilidade financeira só pode ser dada a um Gestor ativo.");
        }
        AtribuicaoFinanceira atribuicao = atribuicoes.buscarAtual().orElse(null);
        if (atribuicao == null) {
            atribuicao = atribuicoes.save(new AtribuicaoFinanceira(gestor, capitao));
            auditoria.registrar(capitao.getId(), Entidades.ATRIBUICAO_FINANCEIRA, gestor.getId(), "ATRIBUIDA", detalhes());
        } else if (atribuicao.getGestor().mesmoUsuario(gestor)) {
            throw new RegraDeNegocioException(gestor.getNome() + " já é o Gestor Financeiro.");
        } else {
            Long anteriorId = atribuicao.getGestor().getId();
            atribuicao.transferirPara(gestor, capitao);
            auditoria.registrar(capitao.getId(), Entidades.ATRIBUICAO_FINANCEIRA, gestor.getId(), "TRANSFERIDA",
                    detalhes("gestorAnteriorId", anteriorId));
        }
        return AtribuicaoFinanceiraResposta.de(atribuicao);
    }

    /** Deixa a posição vaga. */
    public void retirar(Long atorId) {
        Usuario capitao = capitao(atorId);
        atribuicoes.travar();
        AtribuicaoFinanceira atribuicao = atribuicoes.buscarAtual()
                .orElseThrow(() -> new RegraDeNegocioException("Nenhum Gestor tem a responsabilidade financeira."));
        Long gestorId = atribuicao.getGestor().getId();
        atribuicoes.delete(atribuicao);
        auditoria.registrar(capitao.getId(), Entidades.ATRIBUICAO_FINANCEIRA, gestorId, "RETIRADA", detalhes());
    }

    /**
     * O Gestor Financeiro só é desativado ou troca de Perfil depois que o Capitão retira ou transfere a
     * responsabilidade. Quem chama já travou o Usuário com {@link UsuarioRepository#travar}; a consulta é feita aqui,
     * e não por {@link Usuario#isGestorFinanceiro()}, para ver uma atribuição gravada enquanto se esperava a trava.
     */
    void exigirQueNaoSejaGestorFinanceiro(Usuario gestor, String acao) {
        if (atribuicoes.existsByGestorId(gestor.getId())) {
            throw new RegraDeNegocioException("O Capitão precisa retirar ou transferir a responsabilidade financeira de "
                    + gestor.getNome() + " antes de este Gestor " + acao + ".");
        }
    }

    private Usuario capitao(Long atorId) {
        Usuario ator = usuarios.findById(atorId).orElseThrow(AtribuicaoFinanceiraService::usuarioNaoEncontrado);
        if (ator.getPerfil() != Perfil.CAPITAO_ADMIN) {
            throw new AcessoNegadoException("Só o Capitão atribui, transfere ou retira a responsabilidade financeira.");
        }
        return ator;
    }

    private static NaoEncontradoException usuarioNaoEncontrado() {
        return new NaoEncontradoException("Usuário não encontrado.");
    }
}
