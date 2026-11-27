package com.procobajaerp.backend.atividades.service;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.atividades.domain.AlocacaoSprint;
import com.procobajaerp.backend.atividades.domain.Atividade;
import com.procobajaerp.backend.atividades.domain.EstadoAtividade;
import com.procobajaerp.backend.atividades.domain.EstimativaFibonacci;
import com.procobajaerp.backend.atividades.domain.HistoricoPlanejamentoAtividade;
import com.procobajaerp.backend.atividades.domain.HistoricoStatusAtividade;
import com.procobajaerp.backend.atividades.domain.PoliticaAtividades;
import com.procobajaerp.backend.atividades.domain.PrioridadeAtividade;
import com.procobajaerp.backend.atividades.domain.RequisitoAlocacaoPendente;
import com.procobajaerp.backend.atividades.domain.Sprint;
import com.procobajaerp.backend.atividades.domain.TipoEntradaSprint;
import com.procobajaerp.backend.atividades.domain.VisaoAtividades;
import com.procobajaerp.backend.atividades.dto.AlertasAtividadeResumo;
import com.procobajaerp.backend.atividades.dto.AlocacaoAtualResumo;
import com.procobajaerp.backend.atividades.dto.ArquivarAtividadeRequisicao;
import com.procobajaerp.backend.atividades.dto.ArquivamentoResumo;
import com.procobajaerp.backend.atividades.dto.AtividadeDetalheResposta;
import com.procobajaerp.backend.atividades.dto.AtividadeResumoResposta;
import com.procobajaerp.backend.atividades.dto.CapacidadesAtividadeResposta;
import com.procobajaerp.backend.atividades.dto.CapacidadesModuloResposta;
import com.procobajaerp.backend.atividades.dto.CriarAtividadeRequisicao;
import com.procobajaerp.backend.atividades.dto.EditarAtividadeRequisicao;
import com.procobajaerp.backend.atividades.dto.HistoricoAtividadeResposta;
import com.procobajaerp.backend.atividades.dto.HistoricoAtividadeResposta.ItemAlocacao;
import com.procobajaerp.backend.atividades.dto.HistoricoAtividadeResposta.ItemAndamento;
import com.procobajaerp.backend.atividades.dto.HistoricoAtividadeResposta.ItemPlanejamento;
import com.procobajaerp.backend.atividades.dto.OpcoesAtividadesResposta;
import com.procobajaerp.backend.atividades.dto.ResponsavelResumo;
import com.procobajaerp.backend.atividades.dto.SprintResumo;
import com.procobajaerp.backend.atividades.dto.SubsistemaAtividadeResumo;
import com.procobajaerp.backend.atividades.repository.AlocacaoSprintRepository;
import com.procobajaerp.backend.atividades.repository.AtividadeRepository;
import com.procobajaerp.backend.atividades.repository.HistoricoPlanejamentoAtividadeRepository;
import com.procobajaerp.backend.atividades.repository.HistoricoStatusAtividadeRepository;
import com.procobajaerp.backend.atividades.repository.SprintRepository;
import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;
import com.procobajaerp.backend.equipe.domain.Visibilidade;
import com.procobajaerp.backend.equipe.dto.Resumo;
import com.procobajaerp.backend.equipe.service.CatalogoEquipeService;
import com.procobajaerp.backend.shared.AcessoNegadoException;
import com.procobajaerp.backend.shared.ConflitoException;
import com.procobajaerp.backend.shared.NaoEncontradoException;
import com.procobajaerp.backend.shared.RegraDeNegocioException;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

/** Gestão de Atividades, Backlog, planejamento e histórico de alterações do Módulo 02. */
@Service
@Transactional
public class AtividadeService {

    private static final TypeReference<LinkedHashMap<String, Object>> MAPA_JSON = new TypeReference<>() {
    };
    private static final Comparator<Atividade> ORDEM_ATIVIDADES = Comparator
            .comparingInt((Atividade a) -> a.getPrioridade().pesoOrdenacao())
            .thenComparing(Atividade::getPrazo, Comparator.nullsLast(Comparator.naturalOrder()))
            .thenComparing(Atividade::getId, Comparator.reverseOrder());

    private final AtividadeRepository atividades;
    private final AlocacaoSprintRepository alocacoes;
    private final SprintRepository sprints;
    private final HistoricoStatusAtividadeRepository historicoStatus;
    private final HistoricoPlanejamentoAtividadeRepository historicoPlanejamento;
    private final CatalogoEquipeService equipe;
    private final JsonMapper json;

    public AtividadeService(AtividadeRepository atividades, AlocacaoSprintRepository alocacoes,
            SprintRepository sprints, HistoricoStatusAtividadeRepository historicoStatus,
            HistoricoPlanejamentoAtividadeRepository historicoPlanejamento, CatalogoEquipeService equipe,
            JsonMapper json) {
        this.atividades = atividades;
        this.alocacoes = alocacoes;
        this.sprints = sprints;
        this.historicoStatus = historicoStatus;
        this.historicoPlanejamento = historicoPlanejamento;
        this.equipe = equipe;
        this.json = json;
    }

    @Transactional(readOnly = true)
    public OpcoesAtividadesResposta opcoes(Long atorId) {
        Usuario ator = equipe.buscarUsuarioCompleto(atorId);
        List<Subsistema> todosSubsistemas = equipe.listarSubsistemas().stream()
                .sorted(MapeadoresAtividades.POR_NOME_SUBSISTEMA)
                .toList();
        List<SubsistemaAtividadeResumo> disponiveis = subsistemasParaCriacao(ator, todosSubsistemas).stream()
                .map(SubsistemaAtividadeResumo::de)
                .toList();
        List<SubsistemaAtividadeResumo> filtro = todosSubsistemas.stream()
                .filter(s -> PoliticaAtividades.podeVerSubsistemaNoFiltro(ator, s))
                .map(SubsistemaAtividadeResumo::de)
                .toList();
        List<ResponsavelResumo> responsaveis = equipe.listarUsuariosCompletos().stream()
                .filter(Usuario::isAtivo)
                .filter(u -> Visibilidade.podeVer(ator, u))
                .sorted(MapeadoresAtividades.POR_NOME_USUARIO)
                .map(ResponsavelResumo::de)
                .toList();
        List<SprintResumo> sprintsOrdenadas = MapeadoresAtividades
                .ordenarSprints(sprints.findAllByOrderByInicioAscIdAsc()).stream()
                .map(SprintResumo::de)
                .toList();
        return new OpcoesAtividadesResposta(
                new CapacidadesModuloResposta(
                        PoliticaAtividades.podeCriarAtividade(ator),
                        PoliticaAtividades.podeCriarAtividadeCompartilhada(ator),
                        PoliticaAtividades.podeGerenciarSprints(ator)),
                disponiveis,
                filtro,
                responsaveis,
                sprintsOrdenadas,
                EstimativaFibonacci.PERMITIDAS);
    }

    @Transactional(readOnly = true)
    public List<AtividadeResumoResposta> listar(Long atorId, VisaoAtividades visao, Long sprintId,
            Long subsistemaId, Long responsavelId, Boolean apenasMinhas, EstadoAtividade status,
            PrioridadeAtividade prioridade, String busca, boolean incluirArquivadas, boolean apenasArquivadas) {
        if (status != null && !status.ehEstadoDeTrabalho()) {
            throw new RegraDeNegocioException(
                    "NAO_CONCLUIDA representa apenas o resultado histórico em Sprints encerradas, não um estado de trabalho.");
        }
        Usuario ator = equipe.buscarUsuarioCompleto(atorId);
        VisaoAtividades visaoEfetiva = visao == null ? VisaoAtividades.TODAS : visao;
        String termo = busca == null || busca.isBlank() ? null : busca.strip().toLowerCase(Locale.ROOT);

        List<Atividade> visiveis = atividades.listarCompletas().stream()
                .filter(a -> PoliticaAtividades.podeVer(ator, a))
                .filter(a -> apenasArquivadas ? a.isArquivada() : (incluirArquivadas || !a.isArquivada()))
                .filter(a -> subsistemaId == null || a.envolveSubsistema(subsistemaId))
                .filter(a -> responsavelId == null || a.temResponsavel(responsavelId))
                .filter(a -> !Boolean.TRUE.equals(apenasMinhas) || a.temResponsavel(ator.getId()))
                .filter(a -> status == null || a.getStatus() == status)
                .filter(a -> prioridade == null || a.getPrioridade() == prioridade)
                .filter(a -> termo == null || contemTermo(a, termo))
                .toList();

        if (visiveis.isEmpty()) {
            return List.of();
        }

        List<Long> ids = visiveis.stream().map(Atividade::getId).toList();
        Map<Long, List<AlocacaoSprint>> passagensPorAtividade = alocacoes.listarPorAtividades(ids).stream()
                .collect(Collectors.groupingBy(al -> al.getAtividade().getId()));

        return visiveis.stream()
                .sorted(ORDEM_ATIVIDADES)
                .filter(a -> atendeFiltroAlocacao(
                        passagensPorAtividade.getOrDefault(a.getId(), List.of()), visaoEfetiva, sprintId))
                .map(a -> resumo(ator, a, passagensPorAtividade.getOrDefault(a.getId(), List.of())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AtividadeResumoResposta> listarBacklog(Long atorId, Long subsistemaId, Long responsavelId,
            Boolean apenasMinhas, EstadoAtividade status, PrioridadeAtividade prioridade, String busca) {
        return listar(atorId, VisaoAtividades.BACKLOG, null, subsistemaId, responsavelId, apenasMinhas, status,
                prioridade, busca, false, false);
    }

    @Transactional(readOnly = true)
    public AtividadeDetalheResposta buscar(Long atorId, Long id) {
        Usuario ator = equipe.buscarUsuarioCompleto(atorId);
        Atividade atividade = buscarVisivel(ator, id);
        return detalhe(ator, atividade, alocacoes.listarPorAtividade(atividade.getId()));
    }

    @Transactional(readOnly = true)
    public HistoricoAtividadeResposta historico(Long atorId, Long id) {
        Usuario ator = equipe.buscarUsuarioCompleto(atorId);
        Atividade atividade = buscarVisivel(ator, id);
        List<ItemAndamento> andamento = historicoStatus.listarPorAtividade(id).stream()
                .map(h -> new ItemAndamento(h.getId(), h.getStatusAnterior(), h.getStatusNovo(),
                        Resumo.de(h.getAlteradoPor()), h.getAlteradoEm(), h.getObservacao()))
                .toList();
        List<ItemPlanejamento> planejamento = historicoPlanejamento.listarPorAtividade(id).stream()
                .map(h -> new ItemPlanejamento(h.getId(), Resumo.de(h.getAlteradoPor()), h.getAlteradoEm(),
                        lerMapa(h.getDadosAnteriores()), lerMapa(h.getDadosNovos())))
                .toList();
        List<ItemAlocacao> passagens = alocacoes.listarPorAtividade(id).stream()
                .map(al -> new ItemAlocacao(
                        al.getId(),
                        SprintResumo.de(al.getSprint()),
                        al.getOrigem(),
                        al.getTransferidaDaAlocacaoId(),
                        al.getEntradaEm(),
                        al.getSaidaEm(),
                        al.getDesfecho(),
                        al.getEstadoNoEncerramento(),
                        al.isRetiradaAntesEncerramento(),
                        Resumo.de(al.getTransferidaPor()),
                        Resumo.de(al.getEncerradaPor()),
                        al.getMotivoTransferencia()))
                .toList();
        return new HistoricoAtividadeResposta(id, andamento, planejamento, passagens);
    }

    public AtividadeDetalheResposta criar(Long atorId, CriarAtividadeRequisicao dados) {
        Usuario ator = equipe.buscarUsuarioCompleto(atorId);
        if (ator.getPerfil() != Perfil.CAPITAO_ADMIN && ator.getPerfil() != Perfil.GESTOR
                && ator.getPerfil() != Perfil.LIDER) {
            throw new AcessoNegadoException("Seu Perfil não permite criar Atividades.");
        }

        List<Long> subsistemaIds = deduplicar(dados.subsistemaIds());
        if (ator.getPerfil() == Perfil.LIDER) {
            if (ator.getSubsistema() == null || subsistemaIds.size() != 1
                    || !subsistemaIds.get(0).equals(ator.getSubsistema().getId())) {
                throw new AcessoNegadoException("O Líder só pode criar Atividades exclusivas do próprio Subsistema.");
            }
            if (!ator.getSubsistema().isAtivo()) {
                throw new RegraDeNegocioException(
                        "O Subsistema precisa estar ativo para receber novas Atividades.");
            }
        }

        EstimativaFibonacci.validar(dados.estimativaFibonacci());
        List<Subsistema> subsistemasResolvidos = resolverSubsistemas(subsistemaIds);
        List<Usuario> responsaveisResolvidos = resolverResponsaveis(deduplicar(dados.responsavelIds()), Set.of());

        OffsetDateTime agora = OffsetDateTime.now();
        Atividade nova = atividades.save(new Atividade(
                dados.titulo().strip(),
                MapeadoresAtividades.normalizarTexto(dados.descricao()),
                dados.prioridade(),
                dados.estimativaFibonacci(),
                dados.prazo(),
                ator,
                agora,
                subsistemasResolvidos,
                responsaveisResolvidos));
        historicoStatus.save(new HistoricoStatusAtividade(nova, null, EstadoAtividade.NAO_INICIADA, ator, agora, null));
        return detalhe(ator, nova, List.of());
    }

    public AtividadeDetalheResposta editar(Long atorId, Long id, EditarAtividadeRequisicao dados) {
        Usuario ator = equipe.buscarUsuarioCompleto(atorId);
        Atividade atividade = buscarVisivel(ator, id);
        exigirPermissaoEdicaoPlanejamento(ator, atividade);
        if (atividade.isArquivada()) {
            throw new ConflitoException("Esta Atividade está arquivada e não pode ser editada.");
        }

        List<Long> subsistemaIds = deduplicar(dados.subsistemaIds());
        if (ator.getPerfil() == Perfil.LIDER && (subsistemaIds.size() != 1
                || ator.getSubsistema() == null
                || !subsistemaIds.get(0).equals(ator.getSubsistema().getId()))) {
            throw new AcessoNegadoException(
                    "O Líder não pode transferir uma Atividade para outro Subsistema nem torná-la compartilhada.");
        }

        EstimativaFibonacci.validar(dados.estimativaFibonacci());
        List<Subsistema> subsistemasResolvidos = resolverSubsistemas(subsistemaIds);
        Set<Long> jaAtribuidos = atividade.getResponsaveis().stream()
                .map(Usuario::getId)
                .collect(Collectors.toSet());
        List<Usuario> responsaveisResolvidos = resolverResponsaveis(deduplicar(dados.responsavelIds()), jaAtribuidos);

        List<AlocacaoSprint> passagens = alocacoes.listarPorAtividade(atividade.getId());
        boolean alocada = passagens.stream().anyMatch(AlocacaoSprint::isAberta);
        if (alocada) {
            validarRequisitosDeAlocacao(dados.prazo(), dados.estimativaFibonacci(), responsaveisResolvidos);
        }

        String novoTitulo = dados.titulo().strip();
        String novaDescricao = MapeadoresAtividades.normalizarTexto(dados.descricao());
        PrioridadeAtividade novaPrioridade = dados.prioridade() == null ? PrioridadeAtividade.MEDIA : dados.prioridade();

        Map<String, Object> anteriores = new LinkedHashMap<>();
        Map<String, Object> novos = new LinkedHashMap<>();
        registrarMudancasPlanejamento(
                atividade, novoTitulo, novaDescricao, novaPrioridade, dados.estimativaFibonacci(), dados.prazo(),
                subsistemasResolvidos, responsaveisResolvidos, anteriores, novos);

        if (!anteriores.isEmpty()) {
            OffsetDateTime agora = OffsetDateTime.now();
            atividade.atualizarPlanejamento(novoTitulo, novaDescricao, novaPrioridade, dados.estimativaFibonacci(),
                    dados.prazo(), subsistemasResolvidos, responsaveisResolvidos, agora);
            historicoPlanejamento.save(new HistoricoPlanejamentoAtividade(
                    atividade, ator, json.writeValueAsString(anteriores), json.writeValueAsString(novos), agora));
        }

        return detalhe(ator, atividade, passagens);
    }

    public AtividadeDetalheResposta arquivar(Long atorId, Long id, ArquivarAtividadeRequisicao dados) {
        Usuario ator = equipe.buscarUsuarioCompleto(atorId);
        Atividade atividade = buscarVisivel(ator, id);
        List<AlocacaoSprint> passagens = alocacoes.listarPorAtividade(atividade.getId());
        AlocacaoSprint alocacaoAberta = passagens.stream().filter(AlocacaoSprint::isAberta).findFirst().orElse(null);

        if (ator.getPerfil() != Perfil.CAPITAO_ADMIN && ator.getPerfil() != Perfil.GESTOR) {
            if (ator.getPerfil() != Perfil.LIDER || ator.getSubsistema() == null
                    || !atividade.exclusivaDoSubsistema(ator.getSubsistema().getId())) {
                throw new AcessoNegadoException("Seu Perfil não permite arquivar esta Atividade.");
            }
            if (alocacaoAberta != null) {
                throw new AcessoNegadoException(
                        "O Líder só pode arquivar Atividades exclusivas do próprio Subsistema que estejam no Backlog.");
            }
        }
        if (atividade.isArquivada()) {
            throw new ConflitoException("Esta Atividade já está arquivada.");
        }

        String motivo = dados.motivo().strip();
        OffsetDateTime agora = OffsetDateTime.now();
        if (alocacaoAberta != null) {
            alocacaoAberta.retirarAntesDoEncerramento(ator, motivo, agora);
        }
        atividade.arquivar(ator, motivo, agora);
        return detalhe(ator, atividade, passagens);
    }

    private Atividade buscarVisivel(Usuario ator, Long id) {
        Atividade atividade = atividades.buscarCompleta(id)
                .orElseThrow(() -> new NaoEncontradoException("Atividade não encontrada."));
        if (!PoliticaAtividades.podeVer(ator, atividade)) {
            throw new NaoEncontradoException("Atividade não encontrada.");
        }
        return atividade;
    }

    private static void exigirPermissaoEdicaoPlanejamento(Usuario ator, Atividade atividade) {
        if (ator.getPerfil() == Perfil.CAPITAO_ADMIN || ator.getPerfil() == Perfil.GESTOR) {
            return;
        }
        if (ator.getPerfil() == Perfil.LIDER && ator.getSubsistema() != null
                && atividade.exclusivaDoSubsistema(ator.getSubsistema().getId())) {
            return;
        }
        throw new AcessoNegadoException("Seu Perfil não permite editar o planejamento desta Atividade.");
    }

    private List<Subsistema> resolverSubsistemas(List<Long> ids) {
        List<Subsistema> encontrados = equipe.buscarSubsistemas(ids);
        Map<Long, Subsistema> porId = encontrados.stream()
                .collect(Collectors.toMap(Subsistema::getId, Function.identity()));
        List<Subsistema> ordenados = new ArrayList<>(ids.size());
        for (Long id : ids) {
            Subsistema sub = porId.get(id);
            if (sub == null) {
                throw new NaoEncontradoException("Subsistema não encontrado.");
            }
            ordenados.add(sub);
        }
        return ordenados;
    }

    private List<Usuario> resolverResponsaveis(List<Long> ids, Set<Long> jaAtribuidos) {
        if (ids.isEmpty()) {
            return List.of();
        }
        List<Usuario> encontrados = equipe.buscarUsuariosCompletos(ids);
        Map<Long, Usuario> porId = encontrados.stream()
                .collect(Collectors.toMap(Usuario::getId, Function.identity()));
        List<Usuario> ordenados = new ArrayList<>(ids.size());
        for (Long id : ids) {
            Usuario usuario = porId.get(id);
            if (usuario == null) {
                throw new NaoEncontradoException("Responsável não encontrado.");
            }
            if (!jaAtribuidos.contains(id) && !usuario.isAtivo()) {
                throw new RegraDeNegocioException(
                        "Apenas Usuários ativos podem ser atribuídos como Responsáveis.",
                        Map.of("erros", Map.of("responsavelIds", usuario.getNome() + " está desativado.")));
            }
            ordenados.add(usuario);
        }
        return ordenados;
    }

    private static void validarRequisitosDeAlocacao(LocalDate prazo, Integer estimativa, List<Usuario> responsaveis) {
        List<RequisitoAlocacaoPendente> faltantes = new ArrayList<>();
        Map<String, String> erros = new LinkedHashMap<>();
        if (prazo == null) {
            faltantes.add(RequisitoAlocacaoPendente.PRAZO);
            erros.put("prazo", "Atividades alocadas em Sprint exigem prazo.");
        }
        if (!EstimativaFibonacci.ehValida(estimativa)) {
            faltantes.add(RequisitoAlocacaoPendente.ESTIMATIVA);
            erros.put("estimativaFibonacci", "Atividades alocadas em Sprint exigem Estimativa Fibonacci válida.");
        }
        if (responsaveis.stream().noneMatch(Usuario::isAtivo)) {
            faltantes.add(RequisitoAlocacaoPendente.RESPONSAVEL_ATIVO);
            erros.put("responsavelIds", "Atividades alocadas em Sprint exigem ao menos um Responsável ativo.");
        }
        if (!faltantes.isEmpty()) {
            throw new RegraDeNegocioException(
                    "Não é possível remover requisitos obrigatórios de uma Atividade alocada em Sprint.",
                    Map.of("requisitosFaltantes", faltantes, "erros", erros));
        }
    }

    private static void registrarMudancasPlanejamento(Atividade atual, String novoTitulo, String novaDescricao,
            PrioridadeAtividade novaPrioridade, Integer novaEstimativa, LocalDate novoPrazo,
            List<Subsistema> novosSubsistemas, List<Usuario> novosResponsaveis,
            Map<String, Object> anteriores, Map<String, Object> novos) {
        if (!Objects.equals(atual.getTitulo(), novoTitulo)) {
            anteriores.put("titulo", atual.getTitulo());
            novos.put("titulo", novoTitulo);
        }
        if (!Objects.equals(atual.getDescricao(), novaDescricao)) {
            anteriores.put("descricao", atual.getDescricao());
            novos.put("descricao", novaDescricao);
        }
        if (!Objects.equals(atual.getPrioridade(), novaPrioridade)) {
            anteriores.put("prioridade", atual.getPrioridade().name());
            novos.put("prioridade", novaPrioridade.name());
        }
        if (!Objects.equals(atual.getEstimativaFibonacci(), novaEstimativa)) {
            anteriores.put("estimativaFibonacci", atual.getEstimativaFibonacci());
            novos.put("estimativaFibonacci", novaEstimativa);
        }
        if (!Objects.equals(atual.getPrazo(), novoPrazo)) {
            anteriores.put("prazo", atual.getPrazo() == null ? null : atual.getPrazo().toString());
            novos.put("prazo", novoPrazo == null ? null : novoPrazo.toString());
        }
        List<Long> subsistemasAntes = atual.getSubsistemas().stream().map(Subsistema::getId).sorted().toList();
        List<Long> subsistemasDepois = novosSubsistemas.stream().map(Subsistema::getId).sorted().toList();
        if (!subsistemasAntes.equals(subsistemasDepois)) {
            anteriores.put("subsistemaIds", subsistemasAntes);
            novos.put("subsistemaIds", subsistemasDepois);
        }
        List<Long> responsaveisAntes = atual.getResponsaveis().stream().map(Usuario::getId).sorted().toList();
        List<Long> responsaveisDepois = novosResponsaveis.stream().map(Usuario::getId).sorted().toList();
        if (!responsaveisAntes.equals(responsaveisDepois)) {
            anteriores.put("responsavelIds", responsaveisAntes);
            novos.put("responsavelIds", responsaveisDepois);
        }
    }

    private static AtividadeResumoResposta resumo(Usuario ator, Atividade atividade, List<AlocacaoSprint> passagens) {
        AlocacaoSprint aberta = alocacaoAberta(passagens);
        int transferencias = contarTransferencias(passagens);
        return new AtividadeResumoResposta(
                atividade.getId(),
                atividade.getTitulo(),
                atividade.getStatus(),
                atividade.getPrioridade(),
                atividade.getEstimativaFibonacci(),
                atividade.getPrazo(),
                atividade.isCompartilhada(),
                MapeadoresAtividades.subsistemasOrdenados(atividade),
                MapeadoresAtividades.responsaveisOrdenados(atividade),
                AlocacaoAtualResumo.de(aberta),
                transferencias,
                atividade.isArquivada(),
                AlertasAtividadeResumo.NENHUM,
                capacidades(ator, atividade, aberta != null),
                atividade.getCriadaEm(),
                atividade.getAtualizadaEm());
    }

    private static AtividadeDetalheResposta detalhe(Usuario ator, Atividade atividade, List<AlocacaoSprint> passagens) {
        AlocacaoSprint aberta = alocacaoAberta(passagens);
        int transferencias = contarTransferencias(passagens);
        return new AtividadeDetalheResposta(
                atividade.getId(),
                atividade.getTitulo(),
                atividade.getDescricao(),
                atividade.getStatus(),
                atividade.getPrioridade(),
                atividade.getEstimativaFibonacci(),
                atividade.getPrazo(),
                atividade.isCompartilhada(),
                MapeadoresAtividades.subsistemasOrdenados(atividade),
                MapeadoresAtividades.responsaveisOrdenados(atividade),
                AlocacaoAtualResumo.de(aberta),
                transferencias,
                ArquivamentoResumo.de(atividade),
                AlertasAtividadeResumo.NENHUM,
                capacidades(ator, atividade, aberta != null),
                Resumo.de(atividade.getCriadaPor()),
                atividade.getCriadaEm(),
                atividade.getAtualizadaEm(),
                atividade.getConcluidaEm());
    }

    private static CapacidadesAtividadeResposta capacidades(Usuario ator, Atividade atividade, boolean alocada) {
        List<EstadoAtividade> transicoes = PoliticaAtividades.podeAlterarAndamento(ator, atividade)
                ? atividade.getStatus().transicoesDisponiveis()
                : List.of();
        List<RequisitoAlocacaoPendente> pendentes = atividade.requisitosAlocacaoPendentes();
        boolean podeAlocar = PoliticaAtividades.podeGerenciarSprints(ator)
                && !atividade.isArquivada()
                && !alocada
                && pendentes.isEmpty();
        boolean podeRetirar = PoliticaAtividades.podeGerenciarSprints(ator)
                && !atividade.isArquivada()
                && alocada
                && atividade.getStatus() != EstadoAtividade.CONCLUIDA;
        return new CapacidadesAtividadeResposta(
                PoliticaAtividades.podeEditarPlanejamento(ator, atividade),
                PoliticaAtividades.podeArquivar(ator, atividade, alocada),
                !transicoes.isEmpty(),
                transicoes,
                PoliticaAtividades.podeReabrir(ator, atividade) && atividade.getStatus() == EstadoAtividade.CONCLUIDA,
                podeAlocar,
                pendentes,
                podeRetirar);
    }

    private static AlocacaoSprint alocacaoAberta(List<AlocacaoSprint> passagens) {
        return passagens.stream().filter(AlocacaoSprint::isAberta).findFirst().orElse(null);
    }

    private static int contarTransferencias(List<AlocacaoSprint> passagens) {
        return (int) passagens.stream().filter(al -> al.getOrigem() == TipoEntradaSprint.TRANSFERENCIA).count();
    }

    private static boolean atendeFiltroAlocacao(List<AlocacaoSprint> passagens, VisaoAtividades visao,
            Long sprintId) {
        AlocacaoSprint aberta = alocacaoAberta(passagens);
        boolean atendeVisao = switch (visao) {
            case TODAS -> true;
            case BACKLOG -> aberta == null;
            case SPRINT -> aberta != null;
        };
        if (!atendeVisao) {
            return false;
        }
        if (sprintId == null) {
            return true;
        }
        if (visao == VisaoAtividades.SPRINT) {
            return aberta != null && aberta.getSprint().getId().equals(sprintId);
        }
        return passagens.stream().anyMatch(al -> al.getSprint().getId().equals(sprintId));
    }

    private static boolean contemTermo(Atividade atividade, String termo) {
        if (atividade.getTitulo().toLowerCase(Locale.ROOT).contains(termo)) {
            return true;
        }
        return atividade.getDescricao() != null
                && atividade.getDescricao().toLowerCase(Locale.ROOT).contains(termo);
    }

    private static List<Subsistema> subsistemasParaCriacao(Usuario ator, List<Subsistema> todos) {
        if (ator.getPerfil().administraEquipe()) {
            return todos;
        }
        if (ator.getPerfil() == Perfil.LIDER && ator.getSubsistema() != null && ator.getSubsistema().isAtivo()) {
            return todos.stream()
                    .filter(s -> s.getId().equals(ator.getSubsistema().getId()))
                    .toList();
        }
        return List.of();
    }

    private Map<String, Object> lerMapa(String conteudo) {
        return json.readValue(conteudo, MAPA_JSON);
    }

    private static List<Long> deduplicar(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return List.copyOf(new LinkedHashSet<>(ids));
    }
}
