package com.procobajaerp.backend.auditoria.domain;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.ColumnTransformer;

import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;

/** Anotação de quem fez uma operação auditável, quando e sobre qual registro (RNF08). Nunca guarda senhas. */
@Entity
@Table(name = "logs_auditoria")
public class RegistroDeAuditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Vazio nas operações do próprio sistema, como a criação do Capitão inicial. */
    @Column(name = "ator_usuario_id")
    private Long atorId;

    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "ator_usuario_id", insertable = false, updatable = false)
    private Usuario ator;

    @Column(name = "subsistema_origem_id")
    private Long subsistemaOrigemId;

    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "subsistema_origem_id", insertable = false, updatable = false)
    private Subsistema subsistemaOrigem;

    @Column(name = "subsistema_destino_id")
    private Long subsistemaDestinoId;

    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "subsistema_destino_id", insertable = false, updatable = false)
    private Subsistema subsistemaDestino;

    @Column(nullable = false, length = 100)
    private String entidade;

    @Column(name = "registro_id", nullable = false)
    private Long registroId;

    @Column(nullable = false, length = 100)
    private String acao;

    @Column(name = "detalhes_json", columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    private String detalhesJson;

    @Column(name = "registrado_em", nullable = false)
    private OffsetDateTime registradoEm;

    protected RegistroDeAuditoria() {
    }

    public RegistroDeAuditoria(Long atorId, String entidade, Long registroId, String acao, String detalhesJson,
            Long subsistemaOrigemId, Long subsistemaDestinoId) {
        this.atorId = atorId;
        this.entidade = entidade;
        this.registroId = registroId;
        this.acao = acao;
        this.detalhesJson = detalhesJson;
        this.subsistemaOrigemId = subsistemaOrigemId;
        this.subsistemaDestinoId = subsistemaDestinoId;
        this.registradoEm = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getAtorId() {
        return atorId;
    }

    public Usuario getAtor() {
        return ator;
    }

    public String getEntidade() {
        return entidade;
    }

    public String getAcao() {
        return acao;
    }

    public OffsetDateTime getRegistradoEm() {
        return registradoEm;
    }

    public Long getSubsistemaOrigemId() {
        return subsistemaOrigemId;
    }

    public Subsistema getSubsistemaOrigem() {
        return subsistemaOrigem;
    }

    public Long getSubsistemaDestinoId() {
        return subsistemaDestinoId;
    }

    public Subsistema getSubsistemaDestino() {
        return subsistemaDestino;
    }
}
