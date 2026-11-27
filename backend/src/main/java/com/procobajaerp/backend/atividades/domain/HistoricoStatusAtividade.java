package com.procobajaerp.backend.atividades.domain;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import com.procobajaerp.backend.equipe.domain.Usuario;

/** Histórico de transições de andamento de uma Atividade no Kanban. */
@Entity
@Table(name = "historico_status_atividades")
public class HistoricoStatusAtividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "atividade_id", nullable = false)
    private Atividade atividade;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(name = "status_anterior", columnDefinition = "estado_atividade")
    private EstadoAtividade statusAnterior;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(name = "status_novo", nullable = false, columnDefinition = "estado_atividade")
    private EstadoAtividade statusNovo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "alterado_por_usuario_id", nullable = false)
    private Usuario alteradoPor;

    @Column(name = "alterado_em", nullable = false, updatable = false)
    private OffsetDateTime alteradoEm;

    @Column(columnDefinition = "text")
    private String observacao;

    protected HistoricoStatusAtividade() {
    }

    public HistoricoStatusAtividade(Atividade atividade, EstadoAtividade statusAnterior, EstadoAtividade statusNovo,
            Usuario alteradoPor, OffsetDateTime alteradoEm, String observacao) {
        this.atividade = atividade;
        this.statusAnterior = statusAnterior;
        this.statusNovo = statusNovo;
        this.alteradoPor = alteradoPor;
        this.alteradoEm = alteradoEm;
        this.observacao = observacao;
    }

    public Long getId() {
        return id;
    }

    public Atividade getAtividade() {
        return atividade;
    }

    public EstadoAtividade getStatusAnterior() {
        return statusAnterior;
    }

    public EstadoAtividade getStatusNovo() {
        return statusNovo;
    }

    public Usuario getAlteradoPor() {
        return alteradoPor;
    }

    public OffsetDateTime getAlteradoEm() {
        return alteradoEm;
    }

    public String getObservacao() {
        return observacao;
    }
}
