package com.procobajaerp.backend.auditoria.controller;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.procobajaerp.backend.auditoria.dto.ConsultaAuditoriaResposta;
import com.procobajaerp.backend.auditoria.service.ConsultaAuditoriaService;
import com.procobajaerp.backend.seguranca.UsuarioAutenticado;

@Validated
@RestController
@RequestMapping("/api/equipe/auditoria")
public class AuditoriaController {

    private final ConsultaAuditoriaService auditoria;

    public AuditoriaController(ConsultaAuditoriaService auditoria) {
        this.auditoria = auditoria;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('AUDITORIA_CONSULTAR')")
    public ConsultaAuditoriaResposta consultar(@AuthenticationPrincipal UsuarioAutenticado eu,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "25") @Min(1) @Max(100) int size,
            @RequestParam(required = false) @Size(max = 100) String entidade,
            @RequestParam(required = false) @Size(max = 100) String acao) {
        return auditoria.consultar(eu.getId(), page, size, entidade, acao);
    }
}
