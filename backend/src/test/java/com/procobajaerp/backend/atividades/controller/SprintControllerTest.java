package com.procobajaerp.backend.atividades.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpSession;

import com.jayway.jsonpath.JsonPath;
import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.equipe.domain.Perfil;

class SprintControllerTest extends TesteDeIntegracao {

    private long capitao;
    private long chassi;
    private long freios;
    private long motorInativo;
    private long gestor;
    private long gestorFinanceiro;
    private long membroChassi;
    private long membroFreios;
    private long orientador;

    @BeforeEach
    void cenarioBase() {
        capitao = usuario("capitao", Perfil.CAPITAO_ADMIN, null);
        chassi = subsistemaComLider("Chassi", "liderchassi");
        freios = subsistemaComLider("Freios", "liderfreios");
        motorInativo = subsistema("Motor");
        gestor = usuario("gestor", Perfil.GESTOR, chassi);
        gestorFinanceiro = usuario("gestor-fin", Perfil.GESTOR, chassi);
        gestorFinanceiro(gestorFinanceiro, capitao);
        membroChassi = usuario("membro-chassi", Perfil.MEMBRO, chassi);
        membroFreios = usuario("membro-freios", Perfil.MEMBRO, freios);
        orientador = usuario("orientador", Perfil.ORIENTADOR, null);
    }

    @Test
    void planejaComDuracaoSugeridaDe15DiasEditaEOrdenaPorSituacao() throws Exception {
        String sprintPadrao = mvc.perform(json(post("/api/sprints"), """
                {"nome":"Sprint 2026.12-A","objetivo":"Suspensão dianteira","inicio":"2026-12-01"}
                """).session(login("gestor")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Sprint 2026.12-A"))
                .andExpect(jsonPath("$.inicio").value("2026-12-01"))
                .andExpect(jsonPath("$.fim").value("2026-12-15"))
                .andExpect(jsonPath("$.iniciadaEm").doesNotExist())
                .andExpect(jsonPath("$.encerradaEm").doesNotExist())
                .andExpect(jsonPath("$.situacao").value("PLANEJADA"))
                .andExpect(jsonPath("$.alertas.dataInicioAlertaPoucoProgresso").value("2026-12-08"))
                .andExpect(jsonPath("$.capacidades.podeEditar").value(true))
                .andExpect(jsonPath("$.capacidades.podeIniciar").value(true))
                .andReturn().getResponse().getContentAsString();
        long s1 = ((Number) JsonPath.read(sprintPadrao, "$.id")).longValue();

        mvc.perform(json(post("/api/sprints"), """
                {"nome":"Período inválido","inicio":"2026-12-10","fim":"2026-12-09"}
                """).session(login("gestor")))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.erros.fim").exists());

        mvc.perform(json(put("/api/sprints/{id}", s1), """
                {"nome":"Sprint 2026.12-A Ajustada","objetivo":"Meta revisada","inicio":"2026-12-02","fim":"2026-12-20"}
                """).session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Sprint 2026.12-A Ajustada"))
                .andExpect(jsonPath("$.inicio").value("2026-12-02"))
                .andExpect(jsonPath("$.fim").value("2026-12-20"));

        long s2 = criarSprint("Sprint 2026.12-B", "2026-12-21", "2027-01-04", "gestor-fin");
        long encerrada = inserirSprintEncerrada("Sprint 2026.11-B",
                LocalDate.of(2026, 11, 16), LocalDate.of(2026, 11, 30));

        mvc.perform(json(post("/api/sprints/{id}/inicio", s2), "{\"confirmacao\":true}")
                        .session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.situacao").value("EM_ANDAMENTO"))
                .andExpect(jsonPath("$.iniciadaEm").exists())
                .andExpect(jsonPath("$.inicio").value("2026-12-21"))
                .andExpect(jsonPath("$.fim").value("2027-01-04"));

        mvc.perform(json(put("/api/sprints/{id}", s2), """
                {"nome":"Sprint 2026.12-B","inicio":"2026-12-22","fim":"2027-01-05"}
                """).session(login("capitao")))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.erros.inicio").exists());

        mvc.perform(json(put("/api/sprints/{id}", s2), """
                {"nome":"Sprint 2026.12-B Estendida","inicio":"2026-12-21","fim":"2027-01-06"}
                """).session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fim").value("2027-01-06"));

        mvc.perform(json(put("/api/sprints/{id}", encerrada), """
                {"nome":"Editar encerrada","inicio":"2026-11-16","fim":"2026-11-30"}
                """).session(login("capitao")))
                .andExpect(status().isConflict());

        mvc.perform(get("/api/sprints").session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value((int) s2))
                .andExpect(jsonPath("$[1].id").value((int) s1))
                .andExpect(jsonPath("$[1].capacidades.podeIniciar").value(false))
                .andExpect(jsonPath("$[1].capacidades.motivoBloqueioInicio").exists())
                .andExpect(jsonPath("$[2].id").value((int) encerrada));

        mvc.perform(get("/api/sprints?situacao=PLANEJADA").session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value((int) s1));
    }

    @Test
    void iniciaComConfirmacaoImpedeSegundaSprintInclusiveSobConcorrencia() throws Exception {
        long s1 = criarSprint("Sprint A", "2026-12-01", "2026-12-15", "capitao");
        long s2 = criarSprint("Sprint B", "2026-12-16", "2026-12-30", "gestor");

        mvc.perform(json(post("/api/sprints/{id}/inicio", s1), "{\"confirmacao\":false}")
                        .session(login("capitao")))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.erros.confirmacao").exists());

        mvc.perform(post("/api/sprints/{id}/inicio", s1)
                        .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                        .session(login("capitao")))
                .andExpect(status().isUnprocessableContent());

        MockHttpSession sessaoCapitao = login("capitao");
        MockHttpSession sessaoGestor = login("gestor");
        ExecutorService pool = Executors.newFixedThreadPool(2);
        CountDownLatch pronto = new CountDownLatch(2);
        CountDownLatch largada = new CountDownLatch(1);
        List<Integer> statusCodes = Collections.synchronizedList(new ArrayList<>());

        try {
            Future<?> f1 = pool.submit(() -> {
                pronto.countDown();
                largada.await();
                int code = mvc.perform(json(post("/api/sprints/{id}/inicio", s1), "{\"confirmacao\":true}")
                                .session(sessaoCapitao))
                        .andReturn().getResponse().getStatus();
                statusCodes.add(code);
                return null;
            });
            Future<?> f2 = pool.submit(() -> {
                pronto.countDown();
                largada.await();
                int code = mvc.perform(json(post("/api/sprints/{id}/inicio", s2), "{\"confirmacao\":true}")
                                .session(sessaoGestor))
                        .andReturn().getResponse().getStatus();
                statusCodes.add(code);
                return null;
            });

            pronto.await();
            largada.countDown();
            f1.get();
            f2.get();
        } finally {
            pool.shutdownNow();
        }

        assertThat(statusCodes).containsExactlyInAnyOrder(200, 409);
        Integer ativas = jdbc.queryForObject(
                "SELECT count(*) FROM sprints WHERE iniciada_em IS NOT NULL AND encerrada_em IS NULL",
                Integer.class);
        assertThat(ativas).isEqualTo(1);
    }

    @Test
    void alocaEmSprintPlanejadaOuEmAndamentoRemoveDoBacklogEImpedeDuplicacao() throws Exception {
        long sprintFutura = criarSprint("Sprint Futura", "2026-12-16", "2026-12-30", "capitao");
        long sprintAtiva = criarSprint("Sprint Ativa", "2026-12-01", "2026-12-15", "capitao");
        mvc.perform(json(post("/api/sprints/{id}/inicio", sprintAtiva), "{\"confirmacao\":true}")
                        .session(login("capitao")))
                .andExpect(status().isOk());

        long atvFutura = criarAtividadeCompleta("Projeto do pedal", chassi, membroChassi);
        long atvAtiva = criarAtividadeCompleta("Teste do freio", freios, membroFreios);
        long atvConcorrente = criarAtividadeCompleta("Usinagem do cubo", chassi, membroChassi);

        mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprintFutura), "{\"atividadeId\":" + atvFutura + "}")
                        .session(login("gestor")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.alocacao.origem").value("INICIAL"))
                .andExpect(jsonPath("$.alocacao.desfecho").value("ALOCADA"))
                .andExpect(jsonPath("$.alocacao.sprint.situacao").value("PLANEJADA"))
                .andExpect(jsonPath("$.atividade.id").value((int) atvFutura));

        mvc.perform(get("/api/atividades/backlog").session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id").value(not(hasItem((int) atvFutura))))
                .andExpect(jsonPath("$[*].id").value(hasItem((int) atvAtiva)));

        mvc.perform(get("/api/atividades/{id}", atvFutura).session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.alocacaoAtual.sprint.id").value((int) sprintFutura))
                .andExpect(jsonPath("$.alocacaoAtual.sprint.situacao").value("PLANEJADA"))
                .andExpect(jsonPath("$.capacidades.podeAlocar").value(false));

        mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprintAtiva), "{\"atividadeId\":" + atvFutura + "}")
                        .session(login("gestor")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.alocacaoAtualId").exists());

        mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprintAtiva), "{\"atividadeId\":" + atvAtiva + "}")
                        .session(login("gestor-fin")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.alocacao.sprint.situacao").value("EM_ANDAMENTO"));

        mvc.perform(get("/api/atividades/backlog").session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id").value(not(hasItem((int) atvAtiva))));

        MockHttpSession sessaoCapitao = login("capitao");
        MockHttpSession sessaoGestor = login("gestor");
        ExecutorService pool = Executors.newFixedThreadPool(2);
        CountDownLatch pronto = new CountDownLatch(2);
        CountDownLatch largada = new CountDownLatch(1);
        List<Integer> statusCodes = Collections.synchronizedList(new ArrayList<>());

        try {
            Future<?> f1 = pool.submit(() -> {
                pronto.countDown();
                largada.await();
                int code = mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprintFutura),
                                "{\"atividadeId\":" + atvConcorrente + "}").session(sessaoCapitao))
                        .andReturn().getResponse().getStatus();
                statusCodes.add(code);
                return null;
            });
            Future<?> f2 = pool.submit(() -> {
                pronto.countDown();
                largada.await();
                int code = mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprintAtiva),
                                "{\"atividadeId\":" + atvConcorrente + "}").session(sessaoGestor))
                        .andReturn().getResponse().getStatus();
                statusCodes.add(code);
                return null;
            });

            pronto.await();
            largada.countDown();
            f1.get();
            f2.get();
        } finally {
            pool.shutdownNow();
        }

        assertThat(statusCodes).containsExactlyInAnyOrder(201, 409);
        Integer abertas = jdbc.queryForObject(
                "SELECT count(*) FROM atividades_sprints WHERE atividade_id = ? AND saida_em IS NULL",
                Integer.class, atvConcorrente);
        assertThat(abertas).isEqualTo(1);
    }

    @Test
    void rejeitaAlocacaoComRequisitosIncompletosOuEstadoInvalido() throws Exception {
        long sprintPlanejada = criarSprint("Sprint Req", "2026-12-01", "2026-12-15", "capitao");
        long sprintEncerrada = inserirSprintEncerrada("Sprint Antiga",
                LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 15));

        String semNada = mvc.perform(json(post("/api/atividades"), """
                {"titulo":"Sem requisitos","subsistemaIds":[%d]}
                """.formatted(chassi)).session(login("capitao")))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long atvSemRequisitos = ((Number) JsonPath.read(semNada, "$.id")).longValue();

        mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprintPlanejada),
                        "{\"atividadeId\":" + atvSemRequisitos + "}").session(login("capitao")))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.requisitosFaltantes",
                        containsInAnyOrder("PRAZO", "ESTIMATIVA", "RESPONSAVEL_ATIVO")))
                .andExpect(jsonPath("$.erros.prazo").exists())
                .andExpect(jsonPath("$.erros.estimativaFibonacci").exists())
                .andExpect(jsonPath("$.erros.responsavelIds").exists());

        long inativoDepois = usuario("desativado-depois", Perfil.MEMBRO, chassi);
        long atvComInativo = criarAtividadeCompleta("Responsável desativado", chassi, inativoDepois);
        mvc.perform(post("/api/usuarios/{id}/desativacao", inativoDepois)
                        .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf())
                        .session(login("capitao")))
                .andExpect(status().isOk());

        mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprintPlanejada),
                        "{\"atividadeId\":" + atvComInativo + "}").session(login("capitao")))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.requisitosFaltantes", containsInAnyOrder("RESPONSAVEL_ATIVO")));

        long atvCompleta = criarAtividadeCompleta("Pronta mas arquivada", chassi, membroChassi);
        mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprintEncerrada),
                        "{\"atividadeId\":" + atvCompleta + "}").session(login("capitao")))
                .andExpect(status().isConflict());

        mvc.perform(json(post("/api/atividades/{id}/arquivamento", atvCompleta), "{\"motivo\":\"Descartada\"}")
                        .session(login("capitao")))
                .andExpect(status().isOk());

        mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprintPlanejada),
                        "{\"atividadeId\":" + atvCompleta + "}").session(login("capitao")))
                .andExpect(status().isConflict());
    }

    @Test
    void aplicaPermissoesEEscopoDeConsultaDeSprints() throws Exception {
        long sprint = criarSprint("Sprint Escopo", "2026-12-01", "2026-12-15", "capitao");
        long atvChassi = criarAtividadeCompleta("Atividade Chassi", chassi, membroChassi);
        long atvFreios = criarAtividadeCompleta("Atividade Freios", freios, membroFreios);
        long atvInativa = criarAtividadeCompleta("Atividade Motor Inativo", motorInativo, membroChassi);

        mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprint), "{\"atividadeId\":" + atvChassi + "}")
                        .session(login("capitao"))).andExpect(status().isCreated());
        mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprint), "{\"atividadeId\":" + atvFreios + "}")
                        .session(login("capitao"))).andExpect(status().isCreated());
        mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprint), "{\"atividadeId\":" + atvInativa + "}")
                        .session(login("capitao"))).andExpect(status().isCreated());

        for (String apelido : List.of("liderchassi", "membro-chassi", "orientador")) {
            MockHttpSession sessao = login(apelido);
            mvc.perform(json(post("/api/sprints"), "{\"nome\":\"Negada\",\"inicio\":\"2026-12-20\"}").session(sessao))
                    .andExpect(status().isForbidden());
            mvc.perform(json(put("/api/sprints/{id}", sprint),
                            "{\"nome\":\"Negada\",\"inicio\":\"2026-12-01\",\"fim\":\"2026-12-15\"}").session(sessao))
                    .andExpect(status().isForbidden());
            mvc.perform(json(post("/api/sprints/{id}/inicio", sprint), "{\"confirmacao\":true}").session(sessao))
                    .andExpect(status().isForbidden());
            mvc.perform(json(post("/api/sprints/{id}/alocacoes", sprint), "{\"atividadeId\":1}").session(sessao))
                    .andExpect(status().isForbidden());
        }

        mvc.perform(get("/api/sprints/{id}", sprint).session(login("orientador")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resumo.total").value(2))
                .andExpect(jsonPath("$.passagens[*].atividadeId",
                        containsInAnyOrder((int) atvChassi, (int) atvFreios)))
                .andExpect(jsonPath("$.capacidades.podeEditar").value(false))
                .andExpect(jsonPath("$.capacidades.podeAlocarAtividades").value(false));

        mvc.perform(get("/api/sprints/{id}", sprint).session(login("membro-freios")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resumo.total").value(1))
                .andExpect(jsonPath("$.passagens[*].atividadeId", containsInAnyOrder((int) atvFreios)));
    }

    private long criarSprint(String nome, String inicio, String fim, String apelido) throws Exception {
        String resposta = mvc.perform(json(post("/api/sprints"), """
                {"nome":"%s","inicio":"%s","fim":"%s"}
                """.formatted(nome, inicio, fim)).session(login(apelido)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return ((Number) JsonPath.read(resposta, "$.id")).longValue();
    }

    private long inserirSprintEncerrada(String nome, LocalDate inicio, LocalDate fim) {
        return jdbc.queryForObject("""
                INSERT INTO sprints (nome, inicio, fim, criada_por_usuario_id, iniciada_em, iniciada_por_usuario_id,
                    encerrada_em, encerrada_por_usuario_id)
                VALUES (?, ?, ?, ?, now() - interval '10 days', ?, now() - interval '1 day', ?)
                RETURNING id""", Long.class, nome, inicio, fim, capitao, capitao, capitao);
    }

    private long criarAtividadeCompleta(String titulo, long subsistemaId, long responsavelId) throws Exception {
        String resposta = mvc.perform(json(post("/api/atividades"), """
                {
                  "titulo":"%s",
                  "estimativaFibonacci":5,
                  "prazo":"2026-12-10",
                  "subsistemaIds":[%d],
                  "responsavelIds":[%d]
                }
                """.formatted(titulo, subsistemaId, responsavelId)).session(login("capitao")))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return ((Number) JsonPath.read(resposta, "$.id")).longValue();
    }
}
