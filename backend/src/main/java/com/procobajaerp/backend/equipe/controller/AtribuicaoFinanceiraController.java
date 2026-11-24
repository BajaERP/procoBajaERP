package com.procobajaerp.backend.equipe.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.procobajaerp.backend.equipe.dto.AtribuicaoFinanceiraResposta;
import com.procobajaerp.backend.equipe.service.AtribuicaoFinanceiraService;
import com.procobajaerp.backend.seguranca.UsuarioAutenticado;

/** Consulta quem exerce automaticamente a responsabilidade financeira. */
@RestController
@RequestMapping("/api/atribuicao-financeira")
public class AtribuicaoFinanceiraController {

    private final AtribuicaoFinanceiraService atribuicaoFinanceira;

    public AtribuicaoFinanceiraController(AtribuicaoFinanceiraService atribuicaoFinanceira) {
        this.atribuicaoFinanceira = atribuicaoFinanceira;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('EQUIPE_CONSULTAR')")
    public AtribuicaoFinanceiraResposta consultar(@AuthenticationPrincipal UsuarioAutenticado eu) {
        return atribuicaoFinanceira.consultar(eu.getId());
    }
}
