package com.procobajaerp.backend.equipe.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.PerfilEntidade;

public interface PerfilRepository extends JpaRepository<PerfilEntidade, Long> {

    Optional<PerfilEntidade> findByNome(Perfil nome);

    @Query("select p.codigo from PerfilEntidade pe join pe.permissoes p where pe.nome = :perfil")
    Set<String> codigosDePermissao(Perfil perfil);
}
