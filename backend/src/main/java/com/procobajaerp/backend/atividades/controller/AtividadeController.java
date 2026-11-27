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

import com.procobajaerp.backend.atividades.domain.EstadoAtividade;
import com.procobajaerp.backend.atividades.domain.PrioridadeAtividade;
import com.procobajaerp.backend.atividades.domain.VisaoAtividades;
import com.procobajaerp.backend.atividades.dto.ArquivarAtividadeRequisicao;
import com.procobajaerp.backend.atividades.dto.AtividadeDetalheResposta;
import com.procobajaerp.backend.atividades.dto.AtividadeResumoResposta;
import com.procobajaerp.backend.atividades.dto.CriarAtividadeRequisicao;
import com.procobajaerp.backend.atividades.dto.EditarAtividadeRequisicao;
import com.procobajaerp.backend.atividades.dto.HistoricoAtividadeResposta;
import com.procobajaerp.backend.atividades.dto.OpcoesAtividadesResposta;
import com.procobajaerp.backend.atividades.service.AtividadeService;
import com.procobajaerp.backend.seguranca.UsuarioAutenticado;

@RestController
@RequestMapping("/api/atividades")
public class AtividadeController {

    private final AtividadeService atividades;

    public AtividadeController(AtividadeService atividades) {
        this.atividades = atividades;
    }

    @GetMapping("/opcoes")
    public OpcoesAtividadesResposta opcoes(@AuthenticationPrincipal UsuarioAutenticado eu) {
        return atividades.opcoes(eu.getId());
    }

    @GetMapping
    public List<AtividadeResumoResposta> listar(
            @AuthenticationPrincipal UsuarioAutenticado eu,
            @RequestParam(required = false) VisaoAtividades visao,
            @RequestParam(required = false) Long sprintId,
            @RequestParam(required = false) Long subsistemaId,
            @RequestParam(required = false) Long responsavelId,
            @RequestParam(required = false) Boolean apenasMinhas,
            @RequestParam(required = false) EstadoAtividade status,
            @RequestParam(required = false) PrioridadeAtividade prioridade,
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "false") boolean incluirArquivadas,
            @RequestParam(defaultValue = "false") boolean apenasArquivadas) {
        return atividades.listar(eu.getId(), visao, sprintId, subsistemaId, responsavelId, apenasMinhas,
                status, prioridade, busca, incluirArquivadas, apenasArquivadas);
    }

    @GetMapping("/backlog")
    public List<AtividadeResumoResposta> listarBacklog(
            @AuthenticationPrincipal UsuarioAutenticado eu,
            @RequestParam(required = false) Long subsistemaId,
            @RequestParam(required = false) Long responsavelId,
            @RequestParam(required = false) Boolean apenasMinhas,
            @RequestParam(required = false) EstadoAtividade status,
            @RequestParam(required = false) PrioridadeAtividade prioridade,
            @RequestParam(required = false) String busca) {
        return atividades.listarBacklog(eu.getId(), subsistemaId, responsavelId, apenasMinhas, status, prioridade,
                busca);
    }

    @GetMapping("/{id}")
    public AtividadeDetalheResposta buscar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id) {
        return atividades.buscar(eu.getId(), id);
    }

    @GetMapping("/{id}/historico")
    public HistoricoAtividadeResposta historico(@AuthenticationPrincipal UsuarioAutenticado eu,
            @PathVariable Long id) {
        return atividades.historico(eu.getId(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AtividadeDetalheResposta criar(@AuthenticationPrincipal UsuarioAutenticado eu,
            @Valid @RequestBody CriarAtividadeRequisicao dados) {
        return atividades.criar(eu.getId(), dados);
    }

    @PutMapping("/{id}")
    public AtividadeDetalheResposta editar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id,
            @Valid @RequestBody EditarAtividadeRequisicao dados) {
        return atividades.editar(eu.getId(), id, dados);
    }

    @PostMapping("/{id}/arquivamento")
    public AtividadeDetalheResposta arquivar(@AuthenticationPrincipal UsuarioAutenticado eu, @PathVariable Long id,
            @Valid @RequestBody ArquivarAtividadeRequisicao dados) {
        return atividades.arquivar(eu.getId(), id, dados);
    }
}
