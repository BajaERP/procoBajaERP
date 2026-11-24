package com.procobajaerp.backend.equipe.domain;

import java.time.OffsetDateTime;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Responsabilidade financeira dada pelo Capitão a um único Gestor ativo, que passa a ser o Gestor Financeiro. Há no
 * máximo uma: a tabela vazia é a posição vaga, e transferir troca o Gestor desta mesma linha.
 */
@Entity
@Table(name = "atribuicao_financeira")
public class AtribuicaoFinanceira {

    /**
     * Permissões que a atribuição soma às do Perfil Gestor. Fica vazio até o módulo Financeiro criar as suas; como a
     * sessão é relida a cada requisição, atribuir ou retirar vale na hora.
     */
    public static final Set<String> PERMISSOES = Set.of();

    /** A chave é sempre 1: o banco recusa uma segunda atribuição. */
    private static final short UNICA = 1;

    @Id
    private Short id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "gestor_usuario_id", nullable = false, unique = true)
    private Usuario gestor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "atribuida_por_usuario_id", nullable = false)
    private Usuario atribuidaPor;

    @Column(name = "atribuida_em", nullable = false)
    private OffsetDateTime atribuidaEm;

    protected AtribuicaoFinanceira() {
    }

    public AtribuicaoFinanceira(Usuario gestor, Usuario capitao) {
        this.id = UNICA;
        transferirPara(gestor, capitao);
    }

    public void transferirPara(Usuario gestor, Usuario capitao) {
        this.gestor = gestor;
        this.atribuidaPor = capitao;
        this.atribuidaEm = OffsetDateTime.now();
    }

    public Usuario getGestor() {
        return gestor;
    }

    public OffsetDateTime getAtribuidaEm() {
        return atribuidaEm;
    }
}
