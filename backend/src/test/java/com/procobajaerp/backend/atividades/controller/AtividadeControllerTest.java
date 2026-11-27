package com.procobajaerp.backend.atividades.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpSession;

import com.jayway.jsonpath.JsonPath;
import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.equipe.domain.Perfil;

import tools.jackson.databind.json.JsonMapper;

class AtividadeControllerTest extends TesteDeIntegracao {

    @Autowired
    private JsonMapper jsonMapper;

    private long capitao;
    private long gestor;
    private long gestorFinanceiro;
    private long chassi;
    private long freios;
    private long eletronica;
    private long motorInativo;
    private long liderChassi;
    private long membroChassi;
    private long membroEletronica;
    private long outroMembroEletronica;
    private long orientador;

    @BeforeEach
    void cenarioBase() {
        capitao = usuario("capitao", Perfil.CAPITAO_ADMIN, null);
        chassi = subsistemaComLider("Chassi", "liderchassi");
        freios = subsistemaComLider("Freios", "liderfreios");
        eletronica = subsistemaComLider("Eletrônica", "lidereletronica");
        motorInativo = subsistema("Motor");
        liderChassi = idPorApelido("liderchassi");
        gestor = usuario("gestor", Perfil.GESTOR, chassi);
        gestorFinanceiro = usuario("gestor-fin", Perfil.GESTOR, chassi);
        gestorFinanceiro(gestorFinanceiro, capitao);
        membroChassi = usuario("membro-chassi", Perfil.MEMBRO, chassi);
        membroEletronica = usuario("membro-eletronica", Perfil.MEMBRO, eletronica);
        outroMembroEletronica = usuario("outro-eletronica", Perfil.MEMBRO, eletronica);
        orientador = usuario("orientador", Perfil.ORIENTADOR, null);
    }

    @Test
    void criaNoBacklogSemPrazoEstimativaOuResponsavelERegistraHistoricoInicial() throws Exception {
        String resposta = mvc.perform(json(post("/api/atividades"), jsonMapper.writeValueAsString(
                        java.util.Map.of("titulo", "  Revisar projeto do chassi  ", "subsistemaIds", List.of(chassi))))
                        .session(login("capitao")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Revisar projeto do chassi"))
                .andExpect(jsonPath("$.status").value("NAO_INICIADA"))
                .andExpect(jsonPath("$.prioridade").value("MEDIA"))
                .andExpect(jsonPath("$.estimativaFibonacci").doesNotExist())
                .andExpect(jsonPath("$.prazo").doesNotExist())
                .andExpect(jsonPath("$.compartilhada").value(false))
                .andExpect(jsonPath("$.subsistemas", hasSize(1)))
                .andExpect(jsonPath("$.responsaveis", hasSize(0)))
                .andExpect(jsonPath("$.alocacaoAtual").doesNotExist())
                .andExpect(jsonPath("$.capacidades.podeAlocar").value(false))
                .andExpect(jsonPath("$.capacidades.requisitosAlocacaoPendentes",
                        containsInAnyOrder("PRAZO", "ESTIMATIVA", "RESPONSAVEL_ATIVO")))
                .andReturn().getResponse().getContentAsString();

        long id = ((Number) JsonPath.read(resposta, "$.id")).longValue();

        mvc.perform(get("/api/atividades/backlog").session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id").value(hasItem((int) id)));

        mvc.perform(get("/api/atividades/{id}/historico", id).session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.andamento", hasSize(1)))
                .andExpect(jsonPath("$.andamento[0].statusAnterior").doesNotExist())
                .andExpect(jsonPath("$.andamento[0].statusNovo").value("NAO_INICIADA"))
                .andExpect(jsonPath("$.andamento[0].alteradoPor.id").value((int) capitao))
                .andExpect(jsonPath("$.planejamento", hasSize(0)))
                .andExpect(jsonPath("$.alocacoes", hasSize(0)));
    }

    @Test
    void validaEscalaFibonacciSubsistemasObrigatoriosEResponsaveisAtivos() throws Exception {
        MockHttpSession sessao = login("gestor");

        for (int valida : List.of(1, 2, 3, 5, 8, 13, 21)) {
            mvc.perform(json(post("/api/atividades"), """
                    {"titulo":"Fib %d","estimativaFibonacci":%d,"subsistemaIds":[%d]}
                    """.formatted(valida, valida, chassi)).session(sessao))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.estimativaFibonacci").value(valida));
        }

        for (int invalida : List.of(0, 4, 6, 34)) {
            mvc.perform(json(post("/api/atividades"), """
                    {"titulo":"Fib invalida","estimativaFibonacci":%d,"subsistemaIds":[%d]}
                    """.formatted(invalida, chassi)).session(sessao))
                    .andExpect(status().isUnprocessableContent())
                    .andExpect(jsonPath("$.erros.estimativaFibonacci").exists());
        }

        mvc.perform(json(post("/api/atividades"), "{\"titulo\":\"Sem subsistema\",\"subsistemaIds\":[]}")
                        .session(sessao))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erros.subsistemaIds").exists());

        long inativo = usuario("inativo", Perfil.MEMBRO, chassi, false);
        mvc.perform(json(post("/api/atividades"), """
                {"titulo":"Com inativo","subsistemaIds":[%d],"responsavelIds":[%d]}
                """.formatted(chassi, inativo)).session(sessao))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.erros.responsavelIds").exists());

        mvc.perform(json(post("/api/atividades"), """
                {"titulo":"Subsistema inexistente","subsistemaIds":[999999]}
                """).session(sessao))
                .andExpect(status().isNotFound());
    }

    @Test
    void gestorFinanceiroTemMesmoAcessoDeGestorECriaAtividadeCompartilhada() throws Exception {
        String criada = mvc.perform(json(post("/api/atividades"), """
                {
                  "titulo":"Integrar cubo e pinça",
                  "descricao":"Conferir interferência",
                  "prioridade":"ALTA",
                  "estimativaFibonacci":8,
                  "prazo":"2026-12-10",
                  "subsistemaIds":[%d,%d],
                  "responsavelIds":[%d,%d]
                }
                """.formatted(chassi, freios, membroChassi, membroEletronica)).session(login("gestor-fin")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.compartilhada").value(true))
                .andExpect(jsonPath("$.subsistemas", hasSize(2)))
                .andExpect(jsonPath("$.responsaveis", hasSize(2)))
                .andExpect(jsonPath("$.capacidades.podeEditarPlanejamento").value(true))
                .andExpect(jsonPath("$.capacidades.podeArquivar").value(true))
                .andExpect(jsonPath("$.capacidades.podeAlocar").value(true))
                .andReturn().getResponse().getContentAsString();

        long id = ((Number) JsonPath.read(criada, "$.id")).longValue();

        mvc.perform(get("/api/atividades/opcoes").session(login("gestor-fin")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.capacidades.podeCriarAtividadeCompartilhada").value(true))
                .andExpect(jsonPath("$.capacidades.podeGerenciarSprints").value(true));

        mvc.perform(get("/api/atividades/{id}", id).session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.capacidades.podeEditarPlanejamento").value(true));
    }

    @Test
    void atividadeCompartilhadaComResponsavelDeOutroSubsistemaRespeitaEscopoDeCadaPerfil() throws Exception {
        long id = criarAtividadeViaApi("gestor", """
                {
                  "titulo":"Suporte dianteiro compartilhado",
                  "prioridade":"URGENTE",
                  "estimativaFibonacci":5,
                  "prazo":"2026-12-05",
                  "subsistemaIds":[%d,%d],
                  "responsavelIds":[%d]
                }
                """.formatted(chassi, freios, membroEletronica));

        mvc.perform(get("/api/atividades/{id}", id).session(login("liderchassi")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.capacidades.podeEditarPlanejamento").value(false))
                .andExpect(jsonPath("$.capacidades.podeArquivar").value(false))
                .andExpect(jsonPath("$.capacidades.podeAlterarAndamento").value(true));

        mvc.perform(json(put("/api/atividades/{id}", id), """
                {"titulo":"Tentativa líder","subsistemaIds":[%d]}
                """.formatted(chassi)).session(login("liderchassi")))
                .andExpect(status().isForbidden());

        mvc.perform(json(post("/api/atividades/{id}/arquivamento", id), "{\"motivo\":\"Não pode\"}")
                        .session(login("liderchassi")))
                .andExpect(status().isForbidden());

        mvc.perform(get("/api/atividades/{id}", id).session(login("membro-eletronica")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.capacidades.podeAlterarAndamento").value(true))
                .andExpect(jsonPath("$.capacidades.podeEditarPlanejamento").value(false));
        mvc.perform(get("/api/atividades", id).session(login("membro-eletronica")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id").value(hasItem((int) id)));

        mvc.perform(get("/api/atividades/{id}", id).session(login("membro-chassi")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.capacidades.podeAlterarAndamento").value(false));

        mvc.perform(get("/api/atividades", id).session(login("outro-eletronica")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
        mvc.perform(get("/api/atividades/{id}", id).session(login("outro-eletronica")))
                .andExpect(status().isNotFound());
        mvc.perform(get("/api/atividades/{id}/historico", id).session(login("outro-eletronica")))
                .andExpect(status().isNotFound());
    }

    @Test
    void liderGerenciaApenasAtividadesExclusivasDoProprioSubsistemaNoBacklog() throws Exception {
        long exclusiva = criarAtividadeViaApi("liderchassi", """
                {"titulo":"Soldar longarina","subsistemaIds":[%d],"responsavelIds":[%d]}
                """.formatted(chassi, membroEletronica));

        mvc.perform(json(post("/api/atividades"), """
                {"titulo":"Outro subsistema","subsistemaIds":[%d]}
                """.formatted(freios)).session(login("liderchassi")))
                .andExpect(status().isForbidden());

        mvc.perform(json(post("/api/atividades"), """
                {"titulo":"Compartilhada pelo líder","subsistemaIds":[%d,%d]}
                """.formatted(chassi, freios)).session(login("liderchassi")))
                .andExpect(status().isForbidden());

        mvc.perform(json(put("/api/atividades/{id}", exclusiva), """
                {"titulo":"Tentativa tornar compartilhada","subsistemaIds":[%d,%d]}
                """.formatted(chassi, freios)).session(login("liderchassi")))
                .andExpect(status().isForbidden());

        mvc.perform(json(put("/api/atividades/{id}", exclusiva), """
                {"titulo":"Soldar longarina v2","estimativaFibonacci":5,"prazo":"2026-12-08","subsistemaIds":[%d],"responsavelIds":[%d]}
                """.formatted(chassi, membroEletronica)).session(login("liderchassi")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Soldar longarina v2"));

        mvc.perform(json(post("/api/atividades/{id}/arquivamento", exclusiva), "{\"motivo\":\"Substituída por revisão\"}")
                        .session(login("liderchassi")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.arquivamento.motivo").value("Substituída por revisão"));

        long alocada = criarAtividadeViaApi("liderchassi", """
                {"titulo":"Exclusiva alocada","estimativaFibonacci":3,"prazo":"2026-12-09","subsistemaIds":[%d],"responsavelIds":[%d]}
                """.formatted(chassi, membroChassi));
        long sprint = criarSprintNoBanco("Sprint Teste", LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 15));
        alocarNoBanco(alocada, sprint);

        mvc.perform(json(post("/api/atividades/{id}/arquivamento", alocada), "{\"motivo\":\"Tentar arquivar alocada\"}")
                        .session(login("liderchassi")))
                .andExpect(status().isForbidden());
    }

    @Test
    void orientadorEMembroTemAcessoRestritoConformeMatriz() throws Exception {
        long deInativo = criarAtividadeViaApi("capitao", """
                {"titulo":"Preparar bancada do motor","subsistemaIds":[%d]}
                """.formatted(motorInativo));
        long deAtivo = criarAtividadeViaApi("capitao", """
                {"titulo":"Testar pedal","subsistemaIds":[%d]}
                """.formatted(freios));

        mvc.perform(get("/api/atividades").session(login("orientador")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id").value(containsInAnyOrder((int) deAtivo)));
        mvc.perform(get("/api/atividades/{id}", deInativo).session(login("orientador")))
                .andExpect(status().isNotFound());
        mvc.perform(json(post("/api/atividades"), """
                {"titulo":"Orientador cria","subsistemaIds":[%d]}
                """.formatted(freios)).session(login("orientador")))
                .andExpect(status().isForbidden());
        mvc.perform(json(put("/api/atividades/{id}", deAtivo), """
                {"titulo":"Orientador edita","subsistemaIds":[%d]}
                """.formatted(freios)).session(login("orientador")))
                .andExpect(status().isForbidden());

        mvc.perform(json(post("/api/atividades"), """
                {"titulo":"Membro cria","subsistemaIds":[%d]}
                """.formatted(chassi)).session(login("membro-chassi")))
                .andExpect(status().isForbidden());
        mvc.perform(json(put("/api/atividades/{id}", deAtivo), """
                {"titulo":"Membro edita","subsistemaIds":[%d]}
                """.formatted(freios)).session(login("membro-chassi")))
                .andExpect(status().isNotFound());
    }

    @Test
    void edicaoRegistraMudancasDePlanejamentoEProtegeRequisitosDeAtividadeAlocada() throws Exception {
        long id = criarAtividadeViaApi("capitao", """
                {
                  "titulo":"Ajustar geometria",
                  "prioridade":"MEDIA",
                  "estimativaFibonacci":5,
                  "prazo":"2026-12-05",
                  "subsistemaIds":[%d],
                  "responsavelIds":[%d]
                }
                """.formatted(chassi, membroChassi));

        mvc.perform(json(put("/api/atividades/{id}", id), """
                {
                  "titulo":"Ajustar geometria",
                  "prioridade":"MEDIA",
                  "estimativaFibonacci":5,
                  "prazo":"2026-12-05",
                  "subsistemaIds":[%d],
                  "responsavelIds":[%d]
                }
                """.formatted(chassi, membroChassi)).session(login("capitao")))
                .andExpect(status().isOk());

        mvc.perform(get("/api/atividades/{id}/historico", id).session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.planejamento", hasSize(0)));

        mvc.perform(json(put("/api/atividades/{id}", id), """
                {
                  "titulo":"Ajustar geometria",
                  "prioridade":"ALTA",
                  "estimativaFibonacci":8,
                  "prazo":"2026-12-12",
                  "subsistemaIds":[%d],
                  "responsavelIds":[%d]
                }
                """.formatted(chassi, membroChassi)).session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.prazo").value("2026-12-12"));

        mvc.perform(get("/api/atividades/{id}/historico", id).session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.planejamento", hasSize(1)))
                .andExpect(jsonPath("$.planejamento[0].dadosAnteriores.prazo").value("2026-12-05"))
                .andExpect(jsonPath("$.planejamento[0].dadosNovos.prazo").value("2026-12-12"))
                .andExpect(jsonPath("$.planejamento[0].dadosAnteriores.estimativaFibonacci").value(5))
                .andExpect(jsonPath("$.planejamento[0].dadosNovos.estimativaFibonacci").value(8))
                .andExpect(jsonPath("$.planejamento[0].dadosAnteriores.titulo").doesNotExist());

        long sprint = criarSprintNoBanco("Sprint 1", LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 15));
        alocarNoBanco(id, sprint);

        mvc.perform(json(put("/api/atividades/{id}", id), """
                {"titulo":"Sem requisitos","subsistemaIds":[%d],"responsavelIds":[]}
                """.formatted(chassi)).session(login("capitao")))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.requisitosFaltantes",
                        containsInAnyOrder("PRAZO", "ESTIMATIVA", "RESPONSAVEL_ATIVO")));
    }

    @Test
    void arquivamentoRemoveDeVisoesAtivasPreservaHistoricoEFechaAlocacaoParaGestor() throws Exception {
        long id = criarAtividadeViaApi("gestor", """
                {
                  "titulo":"Fabricar suporte do volante",
                  "estimativaFibonacci":3,
                  "prazo":"2026-12-07",
                  "subsistemaIds":[%d],
                  "responsavelIds":[%d]
                }
                """.formatted(chassi, membroChassi));
        long sprint = criarSprintNoBanco("Sprint Ativa", LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 15));
        alocarNoBanco(id, sprint);

        mvc.perform(json(post("/api/atividades/{id}/arquivamento", id), "{\"motivo\":\"Escopo cancelado\"}")
                        .session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.alocacaoAtual").doesNotExist())
                .andExpect(jsonPath("$.arquivamento.motivo").value("Escopo cancelado"))
                .andExpect(jsonPath("$.arquivamento.arquivadaPor.id").value((int) gestor));

        mvc.perform(get("/api/atividades").session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        mvc.perform(get("/api/atividades/backlog").session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        mvc.perform(get("/api/atividades?apenasArquivadas=true").session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id").value(containsInAnyOrder((int) id)));

        mvc.perform(get("/api/atividades/{id}/historico", id).session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.alocacoes[0].desfecho").value("RETIRADA"))
                .andExpect(jsonPath("$.alocacoes[0].retiradaAntesEncerramento").value(true))
                .andExpect(jsonPath("$.alocacoes[0].motivoTransferencia").value("Escopo cancelado"));

        mvc.perform(json(post("/api/atividades/{id}/arquivamento", id), "{\"motivo\":\"Duplicado\"}")
                        .session(login("gestor")))
                .andExpect(status().isConflict());

        mvc.perform(json(put("/api/atividades/{id}", id), """
                {"titulo":"Editar arquivada","subsistemaIds":[%d]}
                """.formatted(chassi)).session(login("gestor")))
                .andExpect(status().isConflict());
    }

    @Test
    void filtrosOpcoesESegurancaBasica() throws Exception {
        long a1 = criarAtividadeViaApi("capitao", """
                {"titulo":"Freio dianteiro","prioridade":"URGENTE","subsistemaIds":[%d],"responsavelIds":[%d]}
                """.formatted(freios, membroEletronica));
        long a2 = criarAtividadeViaApi("capitao", """
                {"titulo":"Banco do piloto","prioridade":"BAIXA","subsistemaIds":[%d],"responsavelIds":[%d]}
                """.formatted(chassi, membroChassi));

        mvc.perform(get("/api/atividades").session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value((int) a1))
                .andExpect(jsonPath("$[1].id").value((int) a2));

        mvc.perform(get("/api/atividades?subsistemaId=" + freios + "&busca=DIANTEIRO").session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id").value(containsInAnyOrder((int) a1)));

        mvc.perform(get("/api/atividades?apenasMinhas=true").session(login("membro-eletronica")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].id").value(containsInAnyOrder((int) a1)));

        mvc.perform(get("/api/atividades?status=NAO_CONCLUIDA").session(login("capitao")))
                .andExpect(status().isUnprocessableContent());

        mvc.perform(get("/api/atividades")).andExpect(status().isUnauthorized());

        String cadastro = mvc.perform(json(post("/api/usuarios"), """
                {"nome":"Novo","ra":"99887766","perfil":"MEMBRO","subsistemaId":%d}
                """.formatted(chassi)).session(login("capitao")))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        String senhaProvisoria = JsonPath.read(cadastro, "$.senhaProvisoria");
        MockHttpSession sessaoPendente = (MockHttpSession) mvc.perform(json(post("/api/auth/login"),
                        "{\"ra\":\"99887766\",\"senha\":\"" + senhaProvisoria + "\"}"))
                .andExpect(status().isOk())
                .andReturn().getRequest().getSession();

        mvc.perform(get("/api/atividades").session(sessaoPendente))
                .andExpect(status().isForbidden());
    }

    private long criarAtividadeViaApi(String apelido, String body) throws Exception {
        String resposta = mvc.perform(json(post("/api/atividades"), body).session(login(apelido)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return ((Number) JsonPath.read(resposta, "$.id")).longValue();
    }

    private long criarSprintNoBanco(String nome, LocalDate inicio, LocalDate fim) {
        return jdbc.queryForObject("""
                INSERT INTO sprints (nome, inicio, fim, criada_por_usuario_id)
                VALUES (?, ?, ?, ?)
                RETURNING id""", Long.class, nome, inicio, fim, capitao);
    }

    private void alocarNoBanco(long atividadeId, long sprintId) {
        jdbc.update("""
                INSERT INTO atividades_sprints (atividade_id, sprint_id, origem)
                VALUES (?, ?, 'INICIAL'::tipo_entrada_sprint)""", atividadeId, sprintId);
    }

    private long idPorApelido(String apelido) {
        return jdbc.queryForObject("SELECT id FROM usuarios WHERE ra = ?", Long.class, ra(apelido));
    }
}
