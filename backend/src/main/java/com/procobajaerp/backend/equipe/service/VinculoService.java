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
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.domain.VinculoFinanceiroGestor;
import com.procobajaerp.backend.equipe.dto.VinculoResposta;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.equipe.repository.VinculoRepository;
import com.procobajaerp.backend.shared.AcessoNegadoException;
import com.procobajaerp.backend.shared.NaoEncontradoException;
import com.procobajaerp.backend.shared.RegraDeNegocioException;

/** Vínculos Financeiro–Gestor: só o Capitão os mantém, e eles não dão ao Gestor acesso financeiro algum. */
@Service
@Transactional
public class VinculoService {

    private static final Comparator<VinculoFinanceiroGestor> POR_FINANCEIRO = Comparator.comparing(
            v -> v.getFinanceiro().getNome(), Collator.getInstance(Locale.of("pt", "BR")));

    private final VinculoRepository vinculos;
    private final UsuarioRepository usuarios;
    private final AuditoriaService auditoria;

    public VinculoService(VinculoRepository vinculos, UsuarioRepository usuarios, AuditoriaService auditoria) {
        this.vinculos = vinculos;
        this.usuarios = usuarios;
        this.auditoria = auditoria;
    }

    /** O Capitão vê todos os Vínculos, o Gestor vê os seus e o Financeiro vê o próprio. */
    @Transactional(readOnly = true)
    public List<VinculoResposta> listar(Long atorId) {
        Usuario ator = usuario(atorId);
        Perfil perfil = ator.getPerfil();
        if (perfil != Perfil.CAPITAO_ADMIN && perfil != Perfil.GESTOR && perfil != Perfil.FINANCEIRO) {
            throw new AcessoNegadoException("Seu Perfil não consulta Vínculos Financeiro–Gestor.");
        }
        return vinculos.listarCompletos().stream()
                .filter(v -> perfil == Perfil.CAPITAO_ADMIN
                        || v.getGestor().mesmoUsuario(ator)
                        || v.getFinanceiro().mesmoUsuario(ator))
                .sorted(POR_FINANCEIRO)
                .map(VinculoResposta::de)
                .toList();
    }

    /**
     * Define o Vínculo de um Financeiro ou troca seu Gestor. O primeiro Vínculo ativa a conta, que estava
     * aguardando por ele.
     */
    public VinculoResposta definir(Long atorId, Long financeiroId, Long gestorId) {
        Usuario capitao = capitao(atorId);
        Usuario financeiro = financeiro(financeiroId);
        Usuario gestor = gestorAtivo(gestorId);
        VinculoFinanceiroGestor vinculo = vinculos.findById(financeiroId).orElse(null);
        if (vinculo == null) {
            vinculo = criar(capitao, financeiro, gestor);
            if (!financeiro.isAtivo()) {
                financeiro.reativar();
                auditoria.registrar(capitao.getId(), Entidades.USUARIO, financeiro.getId(), "REATIVADO",
                        detalhes("motivo", "VINCULO_DEFINIDO"));
            }
        } else if (!vinculo.getGestor().mesmoUsuario(gestor)) {
            Long anteriorId = vinculo.getGestor().getId();
            vinculo.alterarGestor(gestor, capitao);
            auditoria.registrar(capitao.getId(), Entidades.VINCULO, financeiroId, "ALTERADO",
                    detalhes("gestorAnteriorId", anteriorId, "gestorId", gestor.getId()));
        }
        return VinculoResposta.de(vinculo);
    }

    /** Sem Vínculo o Financeiro não pode ficar ativo: se estiver, é desativado junto. */
    public void remover(Long atorId, Long financeiroId) {
        Usuario capitao = capitao(atorId);
        VinculoFinanceiroGestor vinculo = vinculos.findById(financeiroId)
                .orElseThrow(() -> new NaoEncontradoException("Este Financeiro não tem Vínculo."));
        Usuario financeiro = vinculo.getFinanceiro();
        vinculos.delete(vinculo);
        auditoria.registrar(capitao.getId(), Entidades.VINCULO, financeiroId, "REMOVIDO",
                detalhes("gestorId", vinculo.getGestor().getId()));
        if (financeiro.isAtivo()) {
            financeiro.desativar();
            auditoria.registrar(capitao.getId(), Entidades.USUARIO, financeiroId, "DESATIVADO",
                    detalhes("motivo", "VINCULO_REMOVIDO"));
        }
    }

    /** Passa todos os Vínculos de um Gestor para outro, como antes de o primeiro trocar de Perfil. */
    public List<VinculoResposta> transferir(Long atorId, Long gestorOrigemId, Long gestorDestinoId) {
        Usuario capitao = capitao(atorId);
        Usuario origem = usuario(gestorOrigemId);
        Usuario destino = gestorAtivo(gestorDestinoId);
        if (origem.mesmoUsuario(destino)) {
            throw new RegraDeNegocioException("Escolha outro Gestor para receber os Vínculos.");
        }
        List<VinculoFinanceiroGestor> doGestor = vinculos.listarDoGestor(origem);
        if (doGestor.isEmpty()) {
            throw new RegraDeNegocioException(origem.getNome() + " não tem Financeiros vinculados.");
        }
        for (VinculoFinanceiroGestor vinculo : doGestor) {
            vinculo.alterarGestor(destino, capitao);
            auditoria.registrar(capitao.getId(), Entidades.VINCULO, vinculo.getFinanceiro().getId(), "TRANSFERIDO",
                    detalhes("gestorAnteriorId", origem.getId(), "gestorId", destino.getId()));
        }
        return doGestor.stream().sorted(POR_FINANCEIRO).map(VinculoResposta::de).toList();
    }

    /** Vínculo criado pelo Capitão ao cadastrar um Financeiro ou ao trocá-lo para esse Perfil. */
    void vincular(Usuario capitao, Usuario financeiro, Long gestorId) {
        criar(capitao, financeiro, gestorAtivo(gestorId));
    }

    /** Quem deixa de ser Financeiro perde o Vínculo. */
    void encerrar(Usuario ator, Usuario financeiro) {
        vinculos.findById(financeiro.getId()).ifPresent(vinculo -> {
            vinculos.delete(vinculo);
            auditoria.registrar(ator.getId(), Entidades.VINCULO, financeiro.getId(), "ENCERRADO",
                    detalhes("gestorId", vinculo.getGestor().getId(), "motivo", "TROCA_DE_PERFIL"));
        });
    }

    boolean temVinculo(Usuario financeiro) {
        return vinculos.existsById(financeiro.getId());
    }

    List<Usuario> financeirosDe(Usuario gestor) {
        return vinculos.listarDoGestor(gestor).stream().map(VinculoFinanceiroGestor::getFinanceiro).toList();
    }

    private VinculoFinanceiroGestor criar(Usuario capitao, Usuario financeiro, Usuario gestor) {
        VinculoFinanceiroGestor vinculo = vinculos.save(new VinculoFinanceiroGestor(financeiro, gestor, capitao));
        auditoria.registrar(capitao.getId(), Entidades.VINCULO, financeiro.getId(), "DEFINIDO",
                detalhes("gestorId", gestor.getId()));
        return vinculo;
    }

    private Usuario capitao(Long atorId) {
        Usuario ator = usuario(atorId);
        if (ator.getPerfil() != Perfil.CAPITAO_ADMIN) {
            throw new AcessoNegadoException("Só o Capitão mantém Vínculos Financeiro–Gestor.");
        }
        return ator;
    }

    private Usuario financeiro(Long id) {
        Usuario financeiro = usuario(id);
        if (financeiro.getPerfil() != Perfil.FINANCEIRO) {
            throw new RegraDeNegocioException("Só Financeiros têm Vínculo com um Gestor.");
        }
        return financeiro;
    }

    private Usuario gestorAtivo(Long id) {
        Usuario gestor = usuario(id);
        if (gestor.getPerfil() != Perfil.GESTOR || !gestor.isAtivo()) {
            throw new RegraDeNegocioException("O Vínculo precisa ser com um Gestor ativo.");
        }
        return gestor;
    }

    private Usuario usuario(Long id) {
        return usuarios.findById(id).orElseThrow(() -> new NaoEncontradoException("Usuário não encontrado."));
    }
}
