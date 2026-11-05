package com.procobajaerp.backend.equipe.domain;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/** Associação organizacional de um Financeiro a um único Gestor, mantida só pelo Capitão. */
@Entity
@Table(name = "vinculos_financeiro_gestor")
public class VinculoFinanceiroGestor {

    @Id
    @Column(name = "financeiro_usuario_id")
    private Long financeiroId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "financeiro_usuario_id")
    private Usuario financeiro;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "gestor_usuario_id", nullable = false)
    private Usuario gestor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "definido_por_usuario_id", nullable = false)
    private Usuario definidoPor;

    @Column(name = "definido_em", nullable = false)
    private OffsetDateTime definidoEm;

    protected VinculoFinanceiroGestor() {
    }

    public VinculoFinanceiroGestor(Usuario financeiro, Usuario gestor, Usuario definidoPor) {
        this.financeiro = financeiro;
        alterarGestor(gestor, definidoPor);
    }

    public void alterarGestor(Usuario gestor, Usuario definidoPor) {
        this.gestor = gestor;
        this.definidoPor = definidoPor;
        this.definidoEm = OffsetDateTime.now();
    }

    public Usuario getFinanceiro() {
        return financeiro;
    }

    public Usuario getGestor() {
        return gestor;
    }

    public OffsetDateTime getDefinidoEm() {
        return definidoEm;
    }
}
