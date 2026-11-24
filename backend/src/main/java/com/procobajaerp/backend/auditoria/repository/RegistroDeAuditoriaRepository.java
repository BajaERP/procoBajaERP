package com.procobajaerp.backend.auditoria.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import com.procobajaerp.backend.auditoria.domain.RegistroDeAuditoria;

public interface RegistroDeAuditoriaRepository extends JpaRepository<RegistroDeAuditoria, Long> {

    @Query(value = """
            select r from RegistroDeAuditoria r
            left join fetch r.ator
            left join fetch r.subsistemaOrigem
            left join fetch r.subsistemaDestino
            where (:entidade = '' or upper(r.entidade) = :entidade)
              and (:acao = '' or upper(r.acao) = :acao)
            """, countQuery = """
            select count(r) from RegistroDeAuditoria r
            where (:entidade = '' or upper(r.entidade) = :entidade)
              and (:acao = '' or upper(r.acao) = :acao)
            """)
    Page<RegistroDeAuditoria> listarTodos(@Param("entidade") String entidade,
            @Param("acao") String acao, Pageable pageable);

    @Query(value = """
            select r from RegistroDeAuditoria r
            left join fetch r.ator
            left join fetch r.subsistemaOrigem
            left join fetch r.subsistemaDestino
            where (r.subsistemaOrigemId = :subsistemaId or r.subsistemaDestinoId = :subsistemaId)
              and (:entidade = '' or upper(r.entidade) = :entidade)
              and (:acao = '' or upper(r.acao) = :acao)
            """, countQuery = """
            select count(r) from RegistroDeAuditoria r
            where (r.subsistemaOrigemId = :subsistemaId or r.subsistemaDestinoId = :subsistemaId)
              and (:entidade = '' or upper(r.entidade) = :entidade)
              and (:acao = '' or upper(r.acao) = :acao)
            """)
    Page<RegistroDeAuditoria> listarDoSubsistema(@Param("subsistemaId") Long subsistemaId,
            @Param("entidade") String entidade, @Param("acao") String acao, Pageable pageable);
}
