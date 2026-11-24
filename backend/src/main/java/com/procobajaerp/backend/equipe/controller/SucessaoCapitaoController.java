package com.procobajaerp.backend.equipe.controller;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.procobajaerp.backend.equipe.dto.SucessaoCapitaoRequisicao;
import com.procobajaerp.backend.equipe.dto.SucessaoCapitaoResposta;
import com.procobajaerp.backend.equipe.service.SucessaoCapitaoService;
import com.procobajaerp.backend.seguranca.UsuarioAutenticado;

/** Sucessão de Capitão em uma única operação validada no servidor. */
@RestController
@RequestMapping("/api/equipe")
public class SucessaoCapitaoController {

    private final SucessaoCapitaoService sucessao;

    public SucessaoCapitaoController(SucessaoCapitaoService sucessao) {
        this.sucessao = sucessao;
    }

    @PostMapping("/sucessao-capitao")
    @PreAuthorize("hasAuthority('USUARIOS_GERENCIAR')")
    public SucessaoCapitaoResposta suceder(@AuthenticationPrincipal UsuarioAutenticado eu,
            @Valid @RequestBody SucessaoCapitaoRequisicao dados) {
        return sucessao.suceder(eu.getId(), dados);
    }

    @GetMapping("/sucessao-capitao/opcoes")
    @PreAuthorize("hasAuthority('USUARIOS_GERENCIAR')")
    public SucessaoCapitaoResposta.Opcoes opcoes(@AuthenticationPrincipal UsuarioAutenticado eu) {
        return sucessao.opcoes(eu.getId());
    }
}
