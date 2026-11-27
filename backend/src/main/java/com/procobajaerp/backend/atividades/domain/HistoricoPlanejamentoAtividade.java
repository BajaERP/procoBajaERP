package com.procobajaerp.backend.atividades.domain;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.ColumnTransformer;

import com.procobajaerp.backend.equipe.domain.Usuario;

/** Registro das alterações de planejamento de uma Atividade (título, descrição, prazo, prioridade, estimativa e vínculos). */
@Entity
@Table(name = "historico_planejamento_atividades")
public class HistoricoPlanejamentoAtividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "atividade_id", nullable = false)
    private Atividade atividade;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "alterado_por_usuario_id", nullable = false)
    private Usuario alteradoPor;

    @Column(name = "dados_anteriores", nullable = false, columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    private String dadosAnteriores;

    @Column(name = "dados_novos", nullable = false, columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    private String dadosNovos;

    @Column(name = "alterado_em", nullable = false, updatable = false)
    private OffsetDateTime alteradoEm;

    protected HistoricoPlanejamentoAtividade() {
    }

    public HistoricoPlanejamentoAtividade(Atividade atividade, Usuario alteradoPor, String dadosAnteriores,
            String dadosNovos, OffsetDateTime alteradoEm) {
        this.atividade = atividade;
        this.alteradoPor = alteradoPor;
        this.dadosAnteriores = dadosAnteriores;
        this.dadosNovos = dadosNovos;
        this.alteradoEm = alteradoEm;
    }

    public Long getId() {
        return id;
    }

    public Atividade getAtividade() {
        return atividade;
    }

    public Usuario getAlteradoPor() {
        return alteradoPor;
    }

    public String getDadosAnteriores() {
        return dadosAnteriores;
    }

    public String getDadosNovos() {
        return dadosNovos;
    }

    public OffsetDateTime getAlteradoEm() {
        return alteradoEm;
    }
}
