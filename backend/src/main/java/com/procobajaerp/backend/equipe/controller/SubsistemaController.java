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

import com.procobajaerp.backend.equipe.dto.DadosDeSubsistemaRequisicao;
import com.procobajaerp.backend.equipe.dto.DesativacaoDeSubsistemaRequisicao;
import com.procobajaerp.backend.equipe.dto.IntegranteRequisicao;
import com.procobajaerp.backend.equipe.dto.SubsistemaResposta;
import com.procobajaerp.backend.equipe.dto.UsuarioResposta;
import com.procobajaerp.backend.equipe.service.SubsistemaService;
import com.procobajaerp.backend.seguranca.UsuarioAutenticado;

@RestController
@RequestMapping("/api/subsistemas")
public class SubsistemaController {

    private final SubsistemaService subsistemas;

    public SubsistemaController(SubsistemaService subsistemas) {
        this.subsistemas = subsistemas;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('EQUIPE_CONSULTAR')")
    public List<SubsistemaResposta> listar(@AuthenticationPrincipal UsuarioAutenticado eu) {
        return subsistemas.listar(eu.getId());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('EQUIPE_CONSULTAR')")
    public SubsistemaResposta buscar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id) {
        return subsistemas.buscar(eu.getId(), id);
    }

    /** Composição do Subsistema. */
    @GetMapping("/{id}/integrantes")
    @PreAuthorize("hasAuthority('EQUIPE_CONSULTAR')")
    public List<UsuarioResposta> integrantes(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id) {
        return subsistemas.integrantes(eu.getId(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('SUBSISTEMAS_GERENCIAR')")
    public SubsistemaResposta criar(@AuthenticationPrincipal UsuarioAutenticado eu,
            @Valid @RequestBody DadosDeSubsistemaRequisicao dados) {
        return subsistemas.criar(eu.getId(), dados);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SUBSISTEMAS_GERENCIAR')")
    public SubsistemaResposta editar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id,
            @Valid @RequestBody DadosDeSubsistemaRequisicao dados) {
        return subsistemas.editar(eu.getId(), id, dados);
    }

    /** Definição de Líder; ativa o Subsistema se ele estiver desativado. */
    @PutMapping("/{id}/lider")
    @PreAuthorize("hasAuthority('SUBSISTEMAS_GERENCIAR')")
    public SubsistemaResposta definirLider(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id,
            @Valid @RequestBody IntegranteRequisicao dados) {
        return subsistemas.definirLider(eu.getId(), id, dados.usuarioId());
    }

    @PostMapping("/{id}/desativacao")
    @PreAuthorize("hasAuthority('SUBSISTEMAS_GERENCIAR')")
    public SubsistemaResposta desativar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id,
            @RequestBody DesativacaoDeSubsistemaRequisicao dados) {
        return subsistemas.desativar(eu.getId(), id, dados.destinoSubsistemaId());
    }

    /** Transferência de integrante para este Subsistema. */
    @PostMapping("/{id}/integrantes")
    @PreAuthorize("hasAuthority('SUBSISTEMAS_GERENCIAR')")
    public UsuarioResposta receberIntegrante(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id,
            @Valid @RequestBody IntegranteRequisicao dados) {
        return subsistemas.receberIntegrante(eu.getId(), id, dados.usuarioId());
    }

    /** Só o Orientador pode sair do Subsistema sem ir para outro. */
    @DeleteMapping("/{id}/integrantes/{usuarioId}")
    @PreAuthorize("hasAuthority('SUBSISTEMAS_GERENCIAR')")
    public UsuarioResposta retirarIntegrante(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id,
            @PathVariable Long usuarioId) {
        return subsistemas.retirarIntegrante(eu.getId(), id, usuarioId);
    }
}
