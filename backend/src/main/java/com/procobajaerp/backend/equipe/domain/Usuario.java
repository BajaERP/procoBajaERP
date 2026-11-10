package com.procobajaerp.backend.equipe.domain;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import com.procobajaerp.backend.shared.AcessoNegadoException;

/** Conta de acesso ao ERP. Nunca é excluída, só desativada. */
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String ra;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "perfil_id", nullable = false)
    private PerfilEntidade perfil;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subsistema_id")
    private Subsistema subsistema;

    @Column(nullable = false)
    private boolean ativo;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    @Column(name = "atualizado_em")
    private OffsetDateTime atualizadoEm;

    protected Usuario() {
    }

    public Usuario(String ra, String nome, String senhaHash, PerfilEntidade perfil, Subsistema subsistema, boolean ativo) {
        this.ra = ra;
        this.nome = nome;
        this.senhaHash = senhaHash;
        this.perfil = perfil;
        this.subsistema = subsistema;
        this.ativo = ativo;
        this.criadoEm = OffsetDateTime.now();
    }

    @PreUpdate
    void marcarAtualizacao() {
        atualizadoEm = OffsetDateTime.now();
    }

    /** Recusa a operação se este Usuário não administra o Perfil informado. */
    public void exigirQueAdministre(Perfil outro) {
        if (!getPerfil().administra(outro)) {
            throw new AcessoNegadoException("O Perfil " + getPerfil().rotulo() + " não administra Usuários com o Perfil "
                    + outro.rotulo() + ".");
        }
    }

    public boolean mesmoUsuario(Usuario outro) {
        return id.equals(outro.id);
    }

    public boolean pertenceA(Subsistema outro) {
        return subsistema != null && outro != null && subsistema.getId().equals(outro.getId());
    }

    public void corrigir(String nome, String ra) {
        this.nome = nome;
        this.ra = ra;
    }

    public void trocarPerfil(PerfilEntidade perfil) {
        this.perfil = perfil;
    }

    public void transferirPara(Subsistema subsistema) {
        this.subsistema = subsistema;
    }

    public void desativar() {
        ativo = false;
    }

    public void reativar() {
        ativo = true;
    }

    public void alterarSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
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

    public String getSenhaHash() {
        return senhaHash;
    }

    public Perfil getPerfil() {
        return perfil.getNome();
    }

    public Subsistema getSubsistema() {
        return subsistema;
    }

    public boolean isAtivo() {
        return ativo;
    }
}
