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

    /** A senha atual é provisória: até trocá-la, o Usuário só acessa a troca da própria senha. */
    @Column(name = "troca_de_senha_pendente", nullable = false)
    private boolean trocaDeSenhaPendente;

    /** Muda a cada redefinição ou troca, encerrando as sessões abertas com a senha anterior. */
    @Column(name = "versao_da_senha", nullable = false)
    private int versaoDaSenha;

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
        this.trocaDeSenhaPendente = true;
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

    /** Senha provisória dada pelo Capitão ou Gestor: exige nova troca e encerra as sessões abertas. */
    public void redefinirSenha(String senhaHash) {
        this.senhaHash = senhaHash;
        this.trocaDeSenhaPendente = true;
        this.versaoDaSenha++;
    }

    /**
     * Senha escolhida pelo próprio Usuário, que deixa de ter troca pendente. Também encerra as outras sessões,
     * inclusive alguma aberta com a Senha provisória por quem a redefiniu.
     */
    public void trocarSenha(String senhaHash) {
        this.senhaHash = senhaHash;
        this.trocaDeSenhaPendente = false;
        this.versaoDaSenha++;
    }

    public boolean isTrocaDeSenhaPendente() {
        return trocaDeSenhaPendente;
    }

    public int getVersaoDaSenha() {
        return versaoDaSenha;
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

    public boolean isGestorFinanceiro() {
        return ativo && getPerfil() == Perfil.GESTOR && subsistema != null
                && "Financeiro".equalsIgnoreCase(subsistema.getNome());
    }
}
