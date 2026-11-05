package com.procobajaerp.backend.seguranca;

import java.io.Serializable;
import java.util.Collection;
import java.util.Set;

import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.service.ContaService.DadosDeAcesso;

/** Quem está logado. As autoridades são os códigos de permissão do Perfil, recarregados a cada requisição. */
public final class UsuarioAutenticado implements UserDetails, CredentialsContainer, Serializable {

    private final Long id;
    private final String ra;
    private final String nome;
    private final Perfil perfil;
    private final Long subsistemaId;
    private final String subsistemaNome;
    private final boolean ativo;
    private final Set<String> permissoes;
    private String senhaHash;

    public UsuarioAutenticado(DadosDeAcesso dados) {
        this.id = dados.id();
        this.ra = dados.ra();
        this.nome = dados.nome();
        this.perfil = dados.perfil();
        this.subsistemaId = dados.subsistemaId();
        this.subsistemaNome = dados.subsistemaNome();
        this.ativo = dados.ativo();
        this.permissoes = Set.copyOf(dados.permissoes());
        this.senhaHash = dados.senhaHash();
    }

    public Long getId() {
        return id;
    }

    public String getRa() {
        return ra;
    }

    public String getNome() {
        return nome;
    }

    public Perfil getPerfil() {
        return perfil;
    }

    public Long getSubsistemaId() {
        return subsistemaId;
    }

    public String getSubsistemaNome() {
        return subsistemaNome;
    }

    public Set<String> getPermissoes() {
        return permissoes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return permissoes.stream().sorted().map(SimpleGrantedAuthority::new).toList();
    }

    @Override
    public String getPassword() {
        return senhaHash;
    }

    @Override
    public String getUsername() {
        return ra;
    }

    @Override
    public boolean isEnabled() {
        return ativo;
    }

    @Override
    public void eraseCredentials() {
        senhaHash = null;
    }

    @Override
    public String toString() {
        return "UsuarioAutenticado[id=" + id + ", perfil=" + perfil + "]";
    }
}
