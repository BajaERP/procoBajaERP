package com.procobajaerp.backend.equipe.service;

import static com.procobajaerp.backend.auditoria.service.AuditoriaService.detalhes;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.auditoria.service.AuditoriaService;
import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.domain.VinculoFinanceiroGestor;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.equipe.repository.VinculoRepository;
import com.procobajaerp.backend.shared.NaoEncontradoException;
import com.procobajaerp.backend.shared.RegraDeNegocioException;

/** Vínculos Financeiro–Gestor: só o Capitão os mantém, e eles não dão ao Gestor acesso financeiro algum. */
@Service
@Transactional
public class VinculoService {

    private final VinculoRepository vinculos;
    private final UsuarioRepository usuarios;
    private final AuditoriaService auditoria;

    public VinculoService(VinculoRepository vinculos, UsuarioRepository usuarios, AuditoriaService auditoria) {
        this.vinculos = vinculos;
        this.usuarios = usuarios;
        this.auditoria = auditoria;
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
