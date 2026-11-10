package com.procobajaerp.backend.equipe.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.hibernate.annotations.Immutable;

/** Operação do catálogo de permissões, semeado por migration e sem edição pelo ERP. */
@Entity
@Immutable
@Table(name = "permissoes")
public class Permissao {

    @Id
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String codigo;

    @Column(nullable = false, length = 60)
    private String recurso;

    @Column(nullable = false, length = 60)
    private String acao;

    @Column(columnDefinition = "text")
    private String descricao;

    protected Permissao() {
    }

    public String getCodigo() {
        return codigo;
    }
}
