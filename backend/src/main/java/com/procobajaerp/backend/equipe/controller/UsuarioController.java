package com.procobajaerp.backend.equipe.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.dto.CadastroDeUsuarioRequisicao;
import com.procobajaerp.backend.equipe.dto.EdicaoDeUsuarioRequisicao;
import com.procobajaerp.backend.equipe.dto.SenhaProvisoriaResposta;
import com.procobajaerp.backend.equipe.dto.TrocaDePerfilRequisicao;
import com.procobajaerp.backend.equipe.dto.UsuarioCadastradoResposta;
import com.procobajaerp.backend.equipe.dto.UsuarioResposta;
import com.procobajaerp.backend.equipe.service.UsuarioService;
import com.procobajaerp.backend.seguranca.UsuarioAutenticado;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarios;

    public UsuarioController(UsuarioService usuarios) {
        this.usuarios = usuarios;
    }

    /** Só os Usuários que o Perfil de quem consulta pode ver; o RA vem nulo quando ele não pode vê-lo. */
    @GetMapping
    @PreAuthorize("hasAuthority('EQUIPE_CONSULTAR')")
    public List<UsuarioResposta> listar(@AuthenticationPrincipal UsuarioAutenticado eu,
            @RequestParam(required = false) Long subsistemaId,
            @RequestParam(required = false) Perfil perfil,
            @RequestParam(required = false) Boolean ativo) {
        return usuarios.listar(eu.getId(), subsistemaId, perfil, ativo);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('EQUIPE_CONSULTAR')")
    public UsuarioResposta buscar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id) {
        return usuarios.buscar(eu.getId(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('USUARIOS_GERENCIAR')")
    public UsuarioCadastradoResposta cadastrar(@AuthenticationPrincipal UsuarioAutenticado eu,
            @Valid @RequestBody CadastroDeUsuarioRequisicao dados) {
        return usuarios.cadastrar(eu.getId(), dados);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USUARIOS_GERENCIAR')")
    public UsuarioResposta editar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id,
            @Valid @RequestBody EdicaoDeUsuarioRequisicao dados) {
        return usuarios.editar(eu.getId(), id, dados);
    }

    @PutMapping("/{id}/perfil")
    @PreAuthorize("hasAuthority('USUARIOS_GERENCIAR')")
    public UsuarioResposta trocarPerfil(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id,
            @Valid @RequestBody TrocaDePerfilRequisicao dados) {
        return usuarios.trocarPerfil(eu.getId(), id, dados);
    }

    @PostMapping("/{id}/desativacao")
    @PreAuthorize("hasAuthority('USUARIOS_GERENCIAR')")
    public UsuarioResposta desativar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id) {
        return usuarios.desativar(eu.getId(), id);
    }

    @PostMapping("/{id}/reativacao")
    @PreAuthorize("hasAuthority('USUARIOS_GERENCIAR')")
    public UsuarioResposta reativar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id) {
        return usuarios.reativar(eu.getId(), id);
    }

    /** Gera uma nova Senha provisória, devolvida só nesta resposta. */
    @PostMapping("/{id}/senha-provisoria")
    @PreAuthorize("hasAuthority('USUARIOS_GERENCIAR')")
    public SenhaProvisoriaResposta redefinirSenha(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id) {
        return usuarios.redefinirSenha(eu.getId(), id);
    }
}
