package com.procobajaerp.backend.equipe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.domain.VinculoFinanceiroGestor;

public interface VinculoRepository extends JpaRepository<VinculoFinanceiroGestor, Long> {

    @Query("select v from VinculoFinanceiroGestor v join fetch v.financeiro where v.gestor = :gestor")
    List<VinculoFinanceiroGestor> listarDoGestor(Usuario gestor);
}
