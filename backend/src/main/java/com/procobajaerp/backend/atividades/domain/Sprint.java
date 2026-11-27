package com.procobajaerp.backend.atividades.domain;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import com.procobajaerp.backend.equipe.domain.Usuario;

/** Ciclo de trabalho da equipe PROCOBAJA (duração sugerida de 15 dias). */
@Entity
@Table(name = "sprints")
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(columnDefinition = "text")
    private String objetivo;

    @Column(nullable = false)
    private LocalDate inicio;

    @Column(nullable = false)
    private LocalDate fim;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "criada_por_usuario_id", nullable = false)
    private Usuario criadaPor;

    @Column(name = "criada_em", nullable = false, updatable = false)
    private OffsetDateTime criadaEm;

    @Column(name = "iniciada_em")
    private OffsetDateTime iniciadaEm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "iniciada_por_usuario_id")
    private Usuario iniciadaPor;

    @Column(name = "encerrada_em")
    private OffsetDateTime encerradaEm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encerrada_por_usuario_id")
    private Usuario encerradaPor;

    protected Sprint() {
    }

    public Sprint(String nome, String objetivo, LocalDate inicio, LocalDate fim, Usuario criadaPor,
            OffsetDateTime criadaEm) {
        this.nome = nome;
        this.objetivo = objetivo;
        this.inicio = inicio;
        this.fim = fim;
        this.criadaPor = criadaPor;
        this.criadaEm = criadaEm;
    }

    public void atualizarPlanejamento(String nome, String objetivo, LocalDate inicio, LocalDate fim) {
        this.nome = nome;
        this.objetivo = objetivo;
        this.inicio = inicio;
        this.fim = fim;
    }

    public void iniciar(Usuario ator, OffsetDateTime agora) {
        this.iniciadaPor = ator;
        this.iniciadaEm = agora;
    }

    public LocalDate dataInicioAlertaPoucoProgresso() {
        long diasInclusivos = ChronoUnit.DAYS.between(inicio, fim) + 1;
        return inicio.plusDays(diasInclusivos / 2);
    }

    public SituacaoSprint getSituacao() {
        if (encerradaEm != null) {
            return SituacaoSprint.ENCERRADA;
        }
        if (iniciadaEm != null) {
            return SituacaoSprint.EM_ANDAMENTO;
        }
        return SituacaoSprint.PLANEJADA;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getObjetivo() {
        return objetivo;
    }

    public LocalDate getInicio() {
        return inicio;
    }

    public LocalDate getFim() {
        return fim;
    }

    public Usuario getCriadaPor() {
        return criadaPor;
    }

    public OffsetDateTime getCriadaEm() {
        return criadaEm;
    }

    public OffsetDateTime getIniciadaEm() {
        return iniciadaEm;
    }

    public Usuario getIniciadaPor() {
        return iniciadaPor;
    }

    public OffsetDateTime getEncerradaEm() {
        return encerradaEm;
    }

    public Usuario getEncerradaPor() {
        return encerradaPor;
    }
}
