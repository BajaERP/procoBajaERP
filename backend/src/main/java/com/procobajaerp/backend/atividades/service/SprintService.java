package com.procobajaerp.backend.atividades.service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.atividades.domain.AlocacaoSprint;
import com.procobajaerp.backend.atividades.domain.Atividade;
import com.procobajaerp.backend.atividades.domain.DesfechoAlocacao;
import com.procobajaerp.backend.atividades.domain.EstimativaFibonacci;
import com.procobajaerp.backend.atividades.domain.PoliticaAtividades;
import com.procobajaerp.backend.atividades.domain.RequisitoAlocacaoPendente;
import com.procobajaerp.backend.atividades.domain.SituacaoSprint;
import com.procobajaerp.backend.atividades.domain.Sprint;
import com.procobajaerp.backend.atividades.domain.TipoEntradaSprint;
import com.procobajaerp.backend.atividades.dto.AlertasSprintResumo;
import com.procobajaerp.backend.atividades.dto.AlocarAtividadeRequisicao;
import com.procobajaerp.backend.atividades.dto.AlocacaoCriadaResposta;
import com.procobajaerp.backend.atividades.dto.AlocacaoCriadaResposta.AlocacaoResumo;
import com.procobajaerp.backend.atividades.dto.AlocacaoCriadaResposta.AtividadeAlocadaResumo;
import com.procobajaerp.backend.atividades.dto.CapacidadesSprintResposta;
import com.procobajaerp.backend.atividades.dto.EditarSprintRequisicao;
import com.procobajaerp.backend.atividades.dto.IniciarSprintRequisicao;
import com.procobajaerp.backend.atividades.dto.PassagemSprintResposta;
import com.procobajaerp.backend.atividades.dto.PlanejarSprintRequisicao;
import com.procobajaerp.backend.atividades.dto.ResumoPassagensSprint;
import com.procobajaerp.backend.atividades.dto.SprintDetalheResposta;
import com.procobajaerp.backend.atividades.dto.SprintResumo;
import com.procobajaerp.backend.atividades.dto.SprintResumoDetalhadoResposta;
import com.procobajaerp.backend.atividades.repository.AlocacaoSprintRepository;
import com.procobajaerp.backend.atividades.repository.AtividadeRepository;
import com.procobajaerp.backend.atividades.repository.SprintRepository;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.dto.Resumo;
import com.procobajaerp.backend.equipe.service.CatalogoEquipeService;
import com.procobajaerp.backend.shared.AcessoNegadoException;
import com.procobajaerp.backend.shared.ConflitoException;
import com.procobajaerp.backend.shared.NaoEncontradoException;
import com.procobajaerp.backend.shared.RegraDeNegocioException;

/** Planejamento, início confirmado e Alocação de Atividades em Sprints (Módulo 02, issue #96). */
@Service
@Transactional
public class SprintService {

    private final SprintRepository sprints;
    private final AtividadeRepository atividades;
    private final AlocacaoSprintRepository alocacoes;
    private final CatalogoEquipeService equipe;

    public SprintService(SprintRepository sprints, AtividadeRepository atividades,
            AlocacaoSprintRepository alocacoes, CatalogoEquipeService equipe) {
        this.sprints = sprints;
        this.atividades = atividades;
        this.alocacoes = alocacoes;
        this.equipe = equipe;
    }

    @Transactional(readOnly = true)
    public List<SprintResumoDetalhadoResposta> listar(Long atorId, SituacaoSprint situacao) {
        Usuario ator = equipe.buscarUsuarioCompleto(atorId);
        List<Sprint> todas = MapeadoresAtividades.ordenarSprints(sprints.listarCompletas());
        Sprint emAndamento = todas.stream()
                .filter(s -> s.getSituacao() == SituacaoSprint.EM_ANDAMENTO)
                .findFirst()
                .orElse(null);

        List<Sprint> filtradas = situacao == null ? todas
                : todas.stream().filter(s -> s.getSituacao() == situacao).toList();
        if (filtradas.isEmpty()) {
            return List.of();
        }

        List<Long> sprintIds = filtradas.stream().map(Sprint::getId).toList();
        Map<Long, List<AlocacaoSprint>> passagensPorSprint = alocacoes.listarComAtividadePorSprints(sprintIds).stream()
                .filter(al -> PoliticaAtividades.podeVer(ator, al.getAtividade()))
                .collect(Collectors.groupingBy(al -> al.getSprint().getId()));

        return filtradas.stream()
                .map(s -> resumoDetalhado(ator, s, passagensPorSprint.getOrDefault(s.getId(), List.of()), emAndamento))
                .toList();
    }

    @Transactional(readOnly = true)
    public SprintDetalheResposta buscar(Long atorId, Long id) {
        Usuario ator = equipe.buscarUsuarioCompleto(atorId);
        Sprint sprint = sprints.buscarCompleta(id)
                .orElseThrow(() -> new NaoEncontradoException("Sprint não encontrada."));
        Sprint emAndamento = sprints.findFirstByIniciadaEmIsNotNullAndEncerradaEmIsNull().orElse(null);
        List<AlocacaoSprint> passagensVisiveis = alocacoes.listarCompletasPorSprint(id).stream()
                .filter(al -> PoliticaAtividades.podeVer(ator, al.getAtividade()))
                .toList();

        return new SprintDetalheResposta(
                sprint.getId(),
                sprint.getNome(),
                sprint.getObjetivo(),
                sprint.getInicio(),
                sprint.getFim(),
                sprint.getIniciadaEm(),
                sprint.getEncerradaEm(),
                sprint.getSituacao(),
                Resumo.de(sprint.getCriadaPor()),
                Resumo.de(sprint.getIniciadaPor()),
                Resumo.de(sprint.getEncerradaPor()),
                resumoPassagens(passagensVisiveis),
                alertas(sprint),
                capacidades(ator, sprint, emAndamento),
                passagensVisiveis.stream().map(SprintService::passagemResposta).toList());
    }

    public SprintResumoDetalhadoResposta planejar(Long atorId, PlanejarSprintRequisicao dados) {
        Usuario ator = exigirGestaoDeSprints(atorId);
        LocalDate inicio = dados.inicio();
        LocalDate fim = dados.fim() == null ? inicio.plusDays(14) : dados.fim();
        validarPeriodo(inicio, fim);

        Sprint salva = sprints.save(new Sprint(
                dados.nome().strip(),
                MapeadoresAtividades.normalizarTexto(dados.objetivo()),
                inicio,
                fim,
                ator,
                OffsetDateTime.now()));
        Sprint emAndamento = sprints.findFirstByIniciadaEmIsNotNullAndEncerradaEmIsNull().orElse(null);
        return resumoDetalhado(ator, salva, List.of(), emAndamento);
    }

    public SprintResumoDetalhadoResposta editar(Long atorId, Long id, EditarSprintRequisicao dados) {
        Usuario ator = exigirGestaoDeSprints(atorId);
        Sprint sprint = sprints.buscarCompleta(id)
                .orElseThrow(() -> new NaoEncontradoException("Sprint não encontrada."));
        if (sprint.getSituacao() == SituacaoSprint.ENCERRADA) {
            throw new ConflitoException("Uma Sprint encerrada não pode ser editada.");
        }
        if (sprint.getSituacao() == SituacaoSprint.EM_ANDAMENTO && !dados.inicio().equals(sprint.getInicio())) {
            throw new RegraDeNegocioException(
                    "A data de início prevista não pode ser alterada depois que a Sprint foi iniciada.",
                    Map.of("erros", Map.of("inicio", "O início previsto permanece fixo após iniciar a Sprint.")));
        }
        validarPeriodo(dados.inicio(), dados.fim());
        sprint.atualizarPlanejamento(dados.nome().strip(), MapeadoresAtividades.normalizarTexto(dados.objetivo()),
                dados.inicio(), dados.fim());

        Sprint emAndamento = sprints.findFirstByIniciadaEmIsNotNullAndEncerradaEmIsNull().orElse(null);
        List<AlocacaoSprint> passagens = alocacoes.listarCompletasPorSprint(id);
        return resumoDetalhado(ator, sprint, passagens, emAndamento);
    }

    public SprintResumoDetalhadoResposta iniciar(Long atorId, Long id, IniciarSprintRequisicao dados) {
        Usuario ator = exigirGestaoDeSprints(atorId);
        if (dados == null || !Boolean.TRUE.equals(dados.confirmacao())) {
            throw new RegraDeNegocioException(
                    "Confirme o início da Sprint para prosseguir.",
                    Map.of("erros", Map.of("confirmacao", "É obrigatório confirmar o início da Sprint.")));
        }

        Sprint sprint = sprints.travar(id)
                .orElseThrow(() -> new NaoEncontradoException("Sprint não encontrada."));
        if (sprint.getSituacao() == SituacaoSprint.ENCERRADA) {
            throw new ConflitoException("Esta Sprint já foi encerrada e não pode ser iniciada novamente.");
        }
        if (sprint.getSituacao() == SituacaoSprint.EM_ANDAMENTO) {
            throw new ConflitoException("Esta Sprint já está em andamento.",
                    Map.of("sprintEmAndamentoId", sprint.getId()));
        }

        sprints.findFirstByIniciadaEmIsNotNullAndEncerradaEmIsNull().ifPresent(ativa -> {
            throw new ConflitoException(
                    "Já existe uma Sprint em andamento (" + ativa.getNome() + "). Encerre-a antes de iniciar outra.",
                    Map.of("sprintEmAndamentoId", ativa.getId()));
        });

        sprint.iniciar(ator, OffsetDateTime.now());
        try {
            sprints.flush();
        } catch (DataIntegrityViolationException ex) {
            if (causouRestricao(ex, "ux_sprint_em_andamento")) {
                throw new ConflitoException(
                        "Já existe uma Sprint em andamento. Encerre-a antes de iniciar outra.");
            }
            throw ex;
        }

        List<AlocacaoSprint> passagens = alocacoes.listarCompletasPorSprint(id);
        return resumoDetalhado(ator, sprint, passagens, sprint);
    }

    public AlocacaoCriadaResposta alocar(Long atorId, Long sprintId, AlocarAtividadeRequisicao dados) {
        exigirGestaoDeSprints(atorId);
        Sprint sprint = sprints.findById(sprintId)
                .orElseThrow(() -> new NaoEncontradoException("Sprint não encontrada."));
        if (sprint.getSituacao() == SituacaoSprint.ENCERRADA) {
            throw new ConflitoException("Não é possível alocar Atividades em uma Sprint encerrada.");
        }

        atividades.travar(dados.atividadeId())
                .orElseThrow(() -> new NaoEncontradoException("Atividade não encontrada."));
        Atividade atividade = atividades.buscarCompleta(dados.atividadeId())
                .orElseThrow(() -> new NaoEncontradoException("Atividade não encontrada."));
        if (atividade.isArquivada()) {
            throw new ConflitoException("Atividades arquivadas não podem ser alocadas em Sprint.");
        }

        alocacoes.buscarAbertaDaAtividade(atividade.getId()).ifPresent(aberta -> {
            throw new ConflitoException(
                    "A Atividade já possui uma Alocação aberta na Sprint " + aberta.getSprint().getNome() + ".",
                    Map.of("alocacaoAtualId", aberta.getId()));
        });

        validarRequisitosDeAlocacao(atividade);

        AlocacaoSprint nova = alocacoes.save(
                new AlocacaoSprint(atividade, sprint, TipoEntradaSprint.INICIAL, OffsetDateTime.now()));
        try {
            alocacoes.flush();
        } catch (DataIntegrityViolationException ex) {
            if (causouRestricao(ex, "ux_atividades_sprints_uma_aberta")) {
                throw new ConflitoException("A Atividade já possui uma Alocação aberta em outra Sprint.");
            }
            throw ex;
        }

        return new AlocacaoCriadaResposta(
                new AlocacaoResumo(
                        nova.getId(),
                        nova.getOrigem(),
                        nova.getEntradaEm(),
                        nova.getSaidaEm(),
                        nova.getDesfecho(),
                        SprintResumo.de(sprint)),
                new AtividadeAlocadaResumo(
                        atividade.getId(),
                        atividade.getTitulo(),
                        atividade.getStatus(),
                        atividade.getPrioridade(),
                        atividade.getEstimativaFibonacci(),
                        atividade.getPrazo(),
                        atividade.isCompartilhada(),
                        MapeadoresAtividades.subsistemasOrdenados(atividade),
                        MapeadoresAtividades.responsaveisOrdenados(atividade)));
    }

    private Usuario exigirGestaoDeSprints(Long atorId) {
        Usuario ator = equipe.buscarUsuarioCompleto(atorId);
        if (!PoliticaAtividades.podeGerenciarSprints(ator)) {
            throw new AcessoNegadoException("Apenas Capitão e Gestores podem gerenciar Sprints e Alocações.");
        }
        return ator;
    }

    private static void validarPeriodo(LocalDate inicio, LocalDate fim) {
        if (fim.isBefore(inicio)) {
            throw new RegraDeNegocioException(
                    "A data final prevista não pode ser anterior à data de início.",
                    Map.of("erros", Map.of("fim", "Informe uma data igual ou posterior ao início da Sprint.")));
        }
    }

    private static void validarRequisitosDeAlocacao(Atividade atividade) {
        List<RequisitoAlocacaoPendente> faltantes = new ArrayList<>();
        Map<String, String> erros = new LinkedHashMap<>();
        if (atividade.getPrazo() == null) {
            faltantes.add(RequisitoAlocacaoPendente.PRAZO);
            erros.put("prazo", "Defina um prazo antes de alocar a Atividade em uma Sprint.");
        }
        if (!EstimativaFibonacci.ehValida(atividade.getEstimativaFibonacci())) {
            faltantes.add(RequisitoAlocacaoPendente.ESTIMATIVA);
            erros.put("estimativaFibonacci",
                    "Defina uma Estimativa Fibonacci válida (1, 2, 3, 5, 8, 13 ou 21) antes de alocar.");
        }
        if (!atividade.temResponsavelAtivo()) {
            faltantes.add(RequisitoAlocacaoPendente.RESPONSAVEL_ATIVO);
            erros.put("responsavelIds", "Atribua pelo menos um Responsável ativo antes de alocar.");
        }
        if (!faltantes.isEmpty()) {
            throw new RegraDeNegocioException(
                    "A Atividade não atende aos requisitos mínimos para alocação em Sprint.",
                    Map.of("requisitosFaltantes", List.copyOf(faltantes), "erros", erros));
        }
    }

    private static SprintResumoDetalhadoResposta resumoDetalhado(Usuario ator, Sprint sprint,
            List<AlocacaoSprint> passagensVisiveis, Sprint emAndamento) {
        return new SprintResumoDetalhadoResposta(
                sprint.getId(),
                sprint.getNome(),
                sprint.getObjetivo(),
                sprint.getInicio(),
                sprint.getFim(),
                sprint.getIniciadaEm(),
                sprint.getEncerradaEm(),
                sprint.getSituacao(),
                Resumo.de(sprint.getCriadaPor()),
                Resumo.de(sprint.getIniciadaPor()),
                Resumo.de(sprint.getEncerradaPor()),
                resumoPassagens(passagensVisiveis),
                alertas(sprint),
                capacidades(ator, sprint, emAndamento));
    }

    private static ResumoPassagensSprint resumoPassagens(List<AlocacaoSprint> passagens) {
        int emAberto = 0;
        int concluidas = 0;
        int naoConcluidas = 0;
        int retiradas = 0;
        for (AlocacaoSprint passagem : passagens) {
            switch (passagem.getDesfecho()) {
                case ALOCADA -> emAberto++;
                case CONCLUIDA -> concluidas++;
                case NAO_CONCLUIDA -> naoConcluidas++;
                case RETIRADA -> retiradas++;
            }
        }
        return new ResumoPassagensSprint(passagens.size(), emAberto, concluidas, naoConcluidas, retiradas);
    }

    private static AlertasSprintResumo alertas(Sprint sprint) {
        return new AlertasSprintResumo(sprint.dataInicioAlertaPoucoProgresso(), false, false);
    }

    private static CapacidadesSprintResposta capacidades(Usuario ator, Sprint sprint, Sprint emAndamento) {
        boolean gestor = PoliticaAtividades.podeGerenciarSprints(ator);
        SituacaoSprint situacao = sprint.getSituacao();
        boolean podeEditar = gestor && situacao != SituacaoSprint.ENCERRADA;
        boolean outraAtiva = emAndamento != null && !emAndamento.getId().equals(sprint.getId());
        boolean podeIniciar = gestor && situacao == SituacaoSprint.PLANEJADA && !outraAtiva;
        String motivoBloqueioInicio = gestor && situacao == SituacaoSprint.PLANEJADA && outraAtiva
                ? "Já existe uma Sprint em andamento (" + emAndamento.getNome() + ")."
                : null;
        boolean podeAlocar = gestor && situacao != SituacaoSprint.ENCERRADA;
        boolean podeEncerrar = gestor && situacao == SituacaoSprint.EM_ANDAMENTO;
        return new CapacidadesSprintResposta(podeEditar, podeIniciar, motivoBloqueioInicio, podeAlocar, podeEncerrar);
    }

    private static PassagemSprintResposta passagemResposta(AlocacaoSprint passagem) {
        Atividade atividade = passagem.getAtividade();
        return new PassagemSprintResposta(
                passagem.getId(),
                atividade.getId(),
                atividade.getTitulo(),
                atividade.getPrioridade(),
                atividade.getEstimativaFibonacci(),
                atividade.getPrazo(),
                atividade.isCompartilhada(),
                MapeadoresAtividades.subsistemasOrdenados(atividade),
                MapeadoresAtividades.responsaveisOrdenados(atividade),
                passagem.getOrigem(),
                passagem.getDesfecho(),
                passagem.getEstadoNoEncerramento(),
                atividade.getStatus(),
                passagem.isRetiradaAntesEncerramento(),
                passagem.getEntradaEm(),
                passagem.getSaidaEm());
    }

    private static boolean causouRestricao(Throwable erro, String indice) {
        for (Throwable atual = erro; atual != null; atual = atual.getCause()) {
            String mensagem = atual.getMessage();
            if (mensagem != null && mensagem.contains(indice)) {
                return true;
            }
        }
        return false;
    }
}
