package com.procobajaerp.backend.equipe.domain;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import org.hibernate.annotations.Immutable;

/** Linha da tabela {@code perfis}, com as permissões fixas do Perfil. O código usa o enum {@link Perfil}. */
@Entity
@Immutable
@Table(name = "perfis")
public class PerfilEntidade {

    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 32)
    private Perfil nome;

    @Column(columnDefinition = "text")
    private String descricao;

    @ManyToMany
    @JoinTable(
            name = "perfil_permissoes",
            joinColumns = @JoinColumn(name = "perfil_id"),
            inverseJoinColumns = @JoinColumn(name = "permissao_id"))
    private Set<Permissao> permissoes = new HashSet<>();

    protected PerfilEntidade() {
    }

    public Perfil getNome() {
        return nome;
    }
}
