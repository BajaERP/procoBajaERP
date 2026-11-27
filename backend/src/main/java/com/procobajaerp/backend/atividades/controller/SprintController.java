package com.procobajaerp.backend.atividades.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
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

import com.procobajaerp.backend.atividades.domain.SituacaoSprint;
import com.procobajaerp.backend.atividades.dto.AlocarAtividadeRequisicao;
import com.procobajaerp.backend.atividades.dto.AlocacaoCriadaResposta;
import com.procobajaerp.backend.atividades.dto.EditarSprintRequisicao;
import com.procobajaerp.backend.atividades.dto.IniciarSprintRequisicao;
import com.procobajaerp.backend.atividades.dto.PlanejarSprintRequisicao;
import com.procobajaerp.backend.atividades.dto.SprintDetalheResposta;
import com.procobajaerp.backend.atividades.dto.SprintResumoDetalhadoResposta;
import com.procobajaerp.backend.atividades.service.SprintService;
import com.procobajaerp.backend.seguranca.UsuarioAutenticado;

@RestController
@RequestMapping("/api/sprints")
public class SprintController {

    private final SprintService sprints;

    public SprintController(SprintService sprints) {
        this.sprints = sprints;
    }

    @GetMapping
    public List<SprintResumoDetalhadoResposta> listar(@AuthenticationPrincipal UsuarioAutenticado eu,
            @RequestParam(required = false) SituacaoSprint situacao) {
        return sprints.listar(eu.getId(), situacao);
    }

    @GetMapping("/{id}")
    public SprintDetalheResposta buscar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id) {
        return sprints.buscar(eu.getId(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SprintResumoDetalhadoResposta planejar(@AuthenticationPrincipal UsuarioAutenticado eu,
            @Valid @RequestBody PlanejarSprintRequisicao dados) {
        return sprints.planejar(eu.getId(), dados);
    }

    @PutMapping("/{id}")
    public SprintResumoDetalhadoResposta editar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id,
            @Valid @RequestBody EditarSprintRequisicao dados) {
        return sprints.editar(eu.getId(), id, dados);
    }

    @PostMapping("/{id}/inicio")
    public SprintResumoDetalhadoResposta iniciar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id,
            @RequestBody(required = false) IniciarSprintRequisicao dados) {
        return sprints.iniciar(eu.getId(), id, dados);
    }

    @PostMapping("/{id}/alocacoes")
    @ResponseStatus(HttpStatus.CREATED)
    public AlocacaoCriadaResposta alocar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id,
            @Valid @RequestBody AlocarAtividadeRequisicao dados) {
        return sprints.alocar(eu.getId(), id, dados);
    }
}
