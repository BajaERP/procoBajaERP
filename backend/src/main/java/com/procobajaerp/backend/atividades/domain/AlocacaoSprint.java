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

/** Passagem de uma Atividade por uma Sprint, preservando origem e desfecho histórico. */
@Entity
@Table(name = "atividades_sprints")
public class AlocacaoSprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "atividade_id", nullable = false)
    private Atividade atividade;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sprint_id", nullable = false)
    private Sprint sprint;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(nullable = false, columnDefinition = "tipo_entrada_sprint")
    private TipoEntradaSprint origem;

    @Column(name = "transferida_da_alocacao_id")
    private Long transferidaDaAlocacaoId;

    @Column(name = "entrada_em", nullable = false, updatable = false)
    private OffsetDateTime entradaEm;

    @Column(name = "saida_em")
    private OffsetDateTime saidaEm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transferida_por_usuario_id")
    private Usuario transferidaPor;

    @Column(name = "motivo_transferencia", columnDefinition = "text")
    private String motivoTransferencia;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(name = "estado_no_encerramento", columnDefinition = "estado_atividade")
    private EstadoAtividade estadoNoEncerramento;

    @Column(name = "retirada_antes_encerramento", nullable = false)
    private boolean retiradaAntesEncerramento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encerrada_por_usuario_id")
    private Usuario encerradaPor;

    protected AlocacaoSprint() {
    }

    public AlocacaoSprint(Atividade atividade, Sprint sprint, TipoEntradaSprint origem, OffsetDateTime entradaEm) {
        this.atividade = atividade;
        this.sprint = sprint;
        this.origem = origem;
        this.entradaEm = entradaEm;
        this.retiradaAntesEncerramento = false;
    }

    public boolean isAberta() {
        return saidaEm == null;
    }

    public DesfechoAlocacao getDesfecho() {
        if (isAberta()) {
            return DesfechoAlocacao.ALOCADA;
        }
        if (retiradaAntesEncerramento) {
            return DesfechoAlocacao.RETIRADA;
        }
        return estadoNoEncerramento == EstadoAtividade.CONCLUIDA
                ? DesfechoAlocacao.CONCLUIDA
                : DesfechoAlocacao.NAO_CONCLUIDA;
    }

    /** Encerra a Alocação aberta por retirada antecipada ou arquivamento autorizado pelo Capitão/Gestor. */
    public void retirarAntesDoEncerramento(Usuario ator, String motivo, OffsetDateTime agora) {
        this.saidaEm = agora;
        this.retiradaAntesEncerramento = true;
        this.encerradaPor = ator;
        this.motivoTransferencia = motivo;
        this.estadoNoEncerramento = null;
    }

    public Long getId() {
        return id;
    }

    public Atividade getAtividade() {
        return atividade;
    }

    public Sprint getSprint() {
        return sprint;
    }

    public TipoEntradaSprint getOrigem() {
        return origem;
    }

    public Long getTransferidaDaAlocacaoId() {
        return transferidaDaAlocacaoId;
    }

    public OffsetDateTime getEntradaEm() {
        return entradaEm;
    }

    public OffsetDateTime getSaidaEm() {
        return saidaEm;
    }

    public Usuario getTransferidaPor() {
        return transferidaPor;
    }

    public String getMotivoTransferencia() {
        return motivoTransferencia;
    }

    public EstadoAtividade getEstadoNoEncerramento() {
        return estadoNoEncerramento;
    }

    public boolean isRetiradaAntesEncerramento() {
        return retiradaAntesEncerramento;
    }

    public Usuario getEncerradaPor() {
        return encerradaPor;
    }
}
