package com.procobajaerp.backend.atividades.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.atividades.domain.Sprint;

public interface SprintRepository extends JpaRepository<Sprint, Long> {

    List<Sprint> findAllByOrderByInicioAscIdAsc();

    Optional<Sprint> findFirstByIniciadaEmIsNotNullAndEncerradaEmIsNull();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Sprint s where s.id = :id")
    Optional<Sprint> travar(Long id);

    @Query("""
            select s from Sprint s
            join fetch s.criadaPor
            left join fetch s.iniciadaPor
            left join fetch s.encerradaPor
            order by s.inicio asc, s.id asc
            """)
    List<Sprint> listarCompletas();

    @Query("""
            select s from Sprint s
            join fetch s.criadaPor
            left join fetch s.iniciadaPor
            left join fetch s.encerradaPor
            where s.id = :id
            """)
    Optional<Sprint> buscarCompleta(Long id);
}
