package com.procobajaerp.backend.equipe.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByRa(String ra);

    boolean existsByRa(String ra);

    /**
     * Carrega o Usuário travando sua linha até o fim da transação. Quem o desativa ou troca seu Perfil e quem lhe dá a
     * responsabilidade financeira passam a se esperar, e cada um vê o que o outro gravou.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from Usuario u where u.id = :id")
    Optional<Usuario> travar(Long id);

    @Query("select u from Usuario u join fetch u.perfil left join fetch u.subsistema where u.id = :id")
    Optional<Usuario> buscarCompleto(Long id);

    @Query("select u from Usuario u join fetch u.perfil left join fetch u.subsistema where u.ra = :ra")
    Optional<Usuario> buscarCompletoPorRa(String ra);

    /** A equipe é pequena: as consultas filtram a visibilidade em memória, sobre a lista completa. */
    @Query("select u from Usuario u join fetch u.perfil left join fetch u.subsistema")
    List<Usuario> listarCompletos();

    @Query("select u from Usuario u join fetch u.perfil where u.subsistema = :subsistema")
    List<Usuario> listarDoSubsistema(Subsistema subsistema);

    long countByPerfilNomeAndAtivoTrue(Perfil perfil);
}
