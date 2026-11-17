package com.procobajaerp.backend.equipe.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.procobajaerp.backend.equipe.dto.AtribuicaoFinanceiraRequisicao;
import com.procobajaerp.backend.equipe.dto.AtribuicaoFinanceiraResposta;
import com.procobajaerp.backend.equipe.service.AtribuicaoFinanceiraService;
import com.procobajaerp.backend.seguranca.UsuarioAutenticado;

/** Gestor Financeiro. Todos consultam quem é; só o Capitão atribui, transfere ou retira. */
@RestController
@RequestMapping("/api/atribuicao-financeira")
public class AtribuicaoFinanceiraController {

    private final AtribuicaoFinanceiraService atribuicaoFinanceira;

    public AtribuicaoFinanceiraController(AtribuicaoFinanceiraService atribuicaoFinanceira) {
        this.atribuicaoFinanceira = atribuicaoFinanceira;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('EQUIPE_CONSULTAR')")
    public AtribuicaoFinanceiraResposta consultar() {
        return atribuicaoFinanceira.consultar();
    }

    /** Atribui a responsabilidade vaga ou a transfere de outro Gestor. */
    @PutMapping
    @PreAuthorize("hasAuthority('ATRIBUICAO_FINANCEIRA_GERENCIAR')")
    public AtribuicaoFinanceiraResposta atribuir(@AuthenticationPrincipal UsuarioAutenticado eu,
            @Valid @RequestBody AtribuicaoFinanceiraRequisicao dados) {
        return atribuicaoFinanceira.atribuir(eu.getId(), dados.gestorId());
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ATRIBUICAO_FINANCEIRA_GERENCIAR')")
    public void retirar(@AuthenticationPrincipal UsuarioAutenticado eu) {
        atribuicaoFinanceira.retirar(eu.getId());
    }
}
