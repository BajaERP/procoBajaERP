package com.procobajaerp.backend.equipe.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.procobajaerp.backend.equipe.domain.AtribuicaoFinanceira;

public interface AtribuicaoFinanceiraRepository extends JpaRepository<AtribuicaoFinanceira, Short> {

    /** A atribuição atual, com o Gestor; vazio quando a posição está vaga. */
    @Query("select a from AtribuicaoFinanceira a join fetch a.gestor")
    Optional<AtribuicaoFinanceira> buscarAtual();

    boolean existsByGestorId(Long gestorId);

    /** Uma mudança na atribuição por vez: a segunda espera a primeira terminar e já vê o seu resultado. */
    @Modifying
    @Query(value = "LOCK TABLE atribuicao_financeira IN EXCLUSIVE MODE", nativeQuery = true)
    void travar();
}
