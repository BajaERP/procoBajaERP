package com.procobajaerp.backend.equipe.service;

import java.util.Optional;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Ra;
import com.procobajaerp.backend.equipe.domain.Senha;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.repository.PerfilRepository;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.shared.NaoEncontradoException;
import com.procobajaerp.backend.shared.RegraDeNegocioException;

/** O que a autenticação precisa saber de um Usuário, sem expor as entidades do módulo de Equipe. */
@Service
@Transactional(readOnly = true)
public class ContaService {

    private final UsuarioRepository usuarios;
    private final PerfilRepository perfis;
    private final PasswordEncoder codificador;

    public ContaService(UsuarioRepository usuarios, PerfilRepository perfis, PasswordEncoder codificador) {
        this.usuarios = usuarios;
        this.perfis = perfis;
        this.codificador = codificador;
    }

    /** Dados para o login, procurando pelo RA normalizado. */
    public Optional<DadosDeAcesso> buscarPorRa(String ra) {
        return usuarios.buscarCompletoPorRa(Ra.normalizar(ra)).map(this::dadosDeAcesso);
    }

    /** Dados atuais de quem já está logado, recarregados a cada requisição. */
    public Optional<DadosDeAcesso> buscarPorId(Long id) {
        return usuarios.buscarCompleto(id).map(this::dadosDeAcesso);
    }

    /** Troca da própria senha, confirmando a atual. Não gera Registro de auditoria. */
    @Transactional
    public void alterarPropriaSenha(Long id, String senhaAtual, String novaSenha) {
        Usuario usuario = usuarios.findById(id).orElseThrow(() -> new NaoEncontradoException("Usuário não encontrado."));
        if (!codificador.matches(senhaAtual, usuario.getSenhaHash())) {
            throw new RegraDeNegocioException("A senha atual não confere.");
        }
        if (senhaAtual.equals(novaSenha)) {
            throw new RegraDeNegocioException("A nova senha precisa ser diferente da atual.");
        }
        Senha.validar(novaSenha);
        usuario.alterarSenhaHash(codificador.encode(novaSenha));
    }

    private DadosDeAcesso dadosDeAcesso(Usuario usuario) {
        return new DadosDeAcesso(
                usuario.getId(),
                usuario.getRa(),
                usuario.getNome(),
                usuario.getPerfil(),
                usuario.getSubsistema() == null ? null : usuario.getSubsistema().getId(),
                usuario.getSubsistema() == null ? null : usuario.getSubsistema().getNome(),
                usuario.getSenhaHash(),
                usuario.isAtivo(),
                perfis.codigosDePermissao(usuario.getPerfil()));
    }

    public record DadosDeAcesso(
            Long id,
            String ra,
            String nome,
            Perfil perfil,
            Long subsistemaId,
            String subsistemaNome,
            String senhaHash,
            boolean ativo,
            Set<String> permissoes) {
    }
}
