package com.procobajaerp.backend.equipe.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsByRa(String ra);

    @Query("select u from Usuario u join fetch u.perfil left join fetch u.subsistema where u.id = :id")
    Optional<Usuario> buscarCompleto(Long id);

    @Query("select u from Usuario u join fetch u.perfil left join fetch u.subsistema where u.ra = :ra")
    Optional<Usuario> buscarCompletoPorRa(String ra);

    long countByPerfilNomeAndAtivoTrue(Perfil perfil);
}
