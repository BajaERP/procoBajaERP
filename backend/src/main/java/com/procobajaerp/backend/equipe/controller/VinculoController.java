package com.procobajaerp.backend.equipe.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.procobajaerp.backend.equipe.dto.TransferenciaDeVinculosRequisicao;
import com.procobajaerp.backend.equipe.dto.VinculoRequisicao;
import com.procobajaerp.backend.equipe.dto.VinculoResposta;
import com.procobajaerp.backend.equipe.service.VinculoService;
import com.procobajaerp.backend.seguranca.UsuarioAutenticado;

/** Vínculos Financeiro–Gestor. Só o Capitão os altera; Gestor e Financeiro consultam os seus. */
@RestController
@RequestMapping("/api/vinculos")
public class VinculoController {

    private final VinculoService vinculos;

    public VinculoController(VinculoService vinculos) {
        this.vinculos = vinculos;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('EQUIPE_CONSULTAR')")
    public List<VinculoResposta> listar(@AuthenticationPrincipal UsuarioAutenticado eu) {
        return vinculos.listar(eu.getId());
    }

    /** Define o Vínculo do Financeiro ou troca o seu Gestor. */
    @PutMapping("/{financeiroId}")
    @PreAuthorize("hasAuthority('VINCULOS_GERENCIAR')")
    public VinculoResposta definir(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long financeiroId,
            @Valid @RequestBody VinculoRequisicao dados) {
        return vinculos.definir(eu.getId(), financeiroId, dados.gestorId());
    }

    @DeleteMapping("/{financeiroId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('VINCULOS_GERENCIAR')")
    public void remover(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long financeiroId) {
        vinculos.remover(eu.getId(), financeiroId);
    }

    /** Passa todos os Vínculos de um Gestor para outro. */
    @PostMapping("/transferencia")
    @PreAuthorize("hasAuthority('VINCULOS_GERENCIAR')")
    public List<VinculoResposta> transferir(@AuthenticationPrincipal UsuarioAutenticado eu,
            @Valid @RequestBody TransferenciaDeVinculosRequisicao dados) {
        return vinculos.transferir(eu.getId(), dados.gestorOrigemId(), dados.gestorDestinoId());
    }
}
