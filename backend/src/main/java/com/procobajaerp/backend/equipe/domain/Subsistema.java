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
import jakarta.persistence.Table;

/**
 * Divisão da equipe. Nasce desativado e sem Líder, já podendo receber Integrantes, e se ativa ao ganhar o
 * primeiro Líder. O banco exige que o Líder seja Integrante do próprio Subsistema e que todo Subsistema
 * ativo tenha Líder.
 */
@Entity
@Table(name = "subsistemas")
public class Subsistema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String nome;

    @Column(columnDefinition = "text")
    private String descricao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lider_usuario_id")
    private Usuario lider;

    @Column(nullable = false)
    private boolean ativo;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    protected Subsistema() {
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public Usuario getLider() {
        return lider;
    }

    public boolean isAtivo() {
        return ativo;
    }
}
