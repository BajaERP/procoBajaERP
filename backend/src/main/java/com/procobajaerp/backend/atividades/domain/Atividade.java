package com.procobajaerp.backend.atividades.domain;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;

/** Trabalho da equipe vinculado a pelo menos um Subsistema, no Backlog ou alocado em uma Sprint. */
@Entity
@Table(name = "atividades")
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String titulo;

    @Column(columnDefinition = "text")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(nullable = false, columnDefinition = "estado_atividade")
    private EstadoAtividade status;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(nullable = false, columnDefinition = "prioridade_atividade")
    private PrioridadeAtividade prioridade;

    @Column(name = "estimativa_fibonacci")
    private Integer estimativaFibonacci;

    private LocalDate prazo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "criada_por_usuario_id", nullable = false)
    private Usuario criadaPor;

    @Column(name = "criada_em", nullable = false, updatable = false)
    private OffsetDateTime criadaEm;

    @Column(name = "atualizada_em")
    private OffsetDateTime atualizadaEm;

    @Column(name = "concluida_em")
    private OffsetDateTime concluidaEm;

    @Column(name = "arquivada_em")
    private OffsetDateTime arquivadaEm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arquivada_por_usuario_id")
    private Usuario arquivadaPor;

    @Column(name = "motivo_arquivamento", columnDefinition = "text")
    private String motivoArquivamento;

    @ManyToMany
    @JoinTable(
            name = "atividades_subsistemas",
            joinColumns = @JoinColumn(name = "atividade_id"),
            inverseJoinColumns = @JoinColumn(name = "subsistema_id"))
    private Set<Subsistema> subsistemas = new LinkedHashSet<>();

    @ManyToMany
    @JoinTable(
            name = "atividades_responsaveis",
            joinColumns = @JoinColumn(name = "atividade_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id"))
    private Set<Usuario> responsaveis = new LinkedHashSet<>();

    protected Atividade() {
    }

    public Atividade(String titulo, String descricao, PrioridadeAtividade prioridade, Integer estimativaFibonacci,
            LocalDate prazo, Usuario criadaPor, OffsetDateTime criadaEm, Collection<Subsistema> subsistemas,
            Collection<Usuario> responsaveis) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.status = EstadoAtividade.NAO_INICIADA;
        this.prioridade = prioridade == null ? PrioridadeAtividade.MEDIA : prioridade;
        this.estimativaFibonacci = estimativaFibonacci;
        this.prazo = prazo;
        this.criadaPor = criadaPor;
        this.criadaEm = criadaEm;
        this.subsistemas.addAll(subsistemas);
        this.responsaveis.addAll(responsaveis);
    }

    public void atualizarPlanejamento(String titulo, String descricao, PrioridadeAtividade prioridade,
            Integer estimativaFibonacci, LocalDate prazo, Collection<Subsistema> novosSubsistemas,
            Collection<Usuario> novosResponsaveis, OffsetDateTime agora) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.prioridade = prioridade == null ? PrioridadeAtividade.MEDIA : prioridade;
        this.estimativaFibonacci = estimativaFibonacci;
        this.prazo = prazo;
        this.subsistemas.clear();
        this.subsistemas.addAll(novosSubsistemas);
        this.responsaveis.clear();
        this.responsaveis.addAll(novosResponsaveis);
        this.atualizadaEm = agora;
    }

    public void arquivar(Usuario ator, String motivo, OffsetDateTime agora) {
        this.arquivadaPor = ator;
        this.motivoArquivamento = motivo;
        this.arquivadaEm = agora;
        this.atualizadaEm = agora;
    }

    public boolean isArquivada() {
        return arquivadaEm != null;
    }

    public boolean isCompartilhada() {
        return subsistemas.size() > 1;
    }

    public boolean envolveSubsistema(Long subsistemaId) {
        return subsistemaId != null && subsistemas.stream().anyMatch(s -> s.getId().equals(subsistemaId));
    }

    public boolean exclusivaDoSubsistema(Long subsistemaId) {
        return subsistemaId != null && subsistemas.size() == 1
                && subsistemas.iterator().next().getId().equals(subsistemaId);
    }

    public boolean temSubsistemaAtivo() {
        return subsistemas.stream().anyMatch(Subsistema::isAtivo);
    }

    public boolean temResponsavel(Long usuarioId) {
        return usuarioId != null && responsaveis.stream().anyMatch(u -> u.getId().equals(usuarioId));
    }

    public boolean temResponsavelAtivo() {
        return responsaveis.stream().anyMatch(Usuario::isAtivo);
    }

    public List<RequisitoAlocacaoPendente> requisitosAlocacaoPendentes() {
        List<RequisitoAlocacaoPendente> pendentes = new ArrayList<>();
        if (prazo == null) {
            pendentes.add(RequisitoAlocacaoPendente.PRAZO);
        }
        if (!EstimativaFibonacci.ehValida(estimativaFibonacci)) {
            pendentes.add(RequisitoAlocacaoPendente.ESTIMATIVA);
        }
        if (!temResponsavelAtivo()) {
            pendentes.add(RequisitoAlocacaoPendente.RESPONSAVEL_ATIVO);
        }
        return List.copyOf(pendentes);
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public EstadoAtividade getStatus() {
        return status;
    }

    public PrioridadeAtividade getPrioridade() {
        return prioridade;
    }

    public Integer getEstimativaFibonacci() {
        return estimativaFibonacci;
    }

    public LocalDate getPrazo() {
        return prazo;
    }

    public Usuario getCriadaPor() {
        return criadaPor;
    }

    public OffsetDateTime getCriadaEm() {
        return criadaEm;
    }

    public OffsetDateTime getAtualizadaEm() {
        return atualizadaEm;
    }

    public OffsetDateTime getConcluidaEm() {
        return concluidaEm;
    }

    public OffsetDateTime getArquivadaEm() {
        return arquivadaEm;
    }

    public Usuario getArquivadaPor() {
        return arquivadaPor;
    }

    public String getMotivoArquivamento() {
        return motivoArquivamento;
    }

    public Set<Subsistema> getSubsistemas() {
        return subsistemas;
    }

    public Set<Usuario> getResponsaveis() {
        return responsaveis;
    }
}
