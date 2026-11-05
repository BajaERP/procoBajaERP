package com.procobajaerp.backend.auditoria.domain;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.ColumnTransformer;

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

    public RegistroDeAuditoria(Long atorId, String entidade, Long registroId, String acao, String detalhesJson) {
        this.atorId = atorId;
        this.entidade = entidade;
        this.registroId = registroId;
        this.acao = acao;
        this.detalhesJson = detalhesJson;
        this.registradoEm = OffsetDateTime.now();
    }
}
