package com.procobajaerp.backend.equipe.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.ResultActions;

import com.jayway.jsonpath.JsonPath;
import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.equipe.domain.Perfil;

class SubsistemaControllerTest extends TesteDeIntegracao {

    private long chassi;
    private long liderChassi;
    private long freios;

    @BeforeEach
    void equipe() {
        usuario("capitao", Perfil.CAPITAO_ADMIN, null);
        usuario("gestor", Perfil.GESTOR, null);
        chassi = subsistemaComLider("Chassi", "liderchassi");
        liderChassi = id("liderchassi");
        freios = subsistemaComLider("Freios", "liderfreios");
    }

    @Test
    void primeiroSubsistemaNasceDesativadoESeAtivaNaDefinicaoDeLider() throws Exception {
        String resposta = mvc.perform(json(post("/api/subsistemas"), Map.of("nome", " Motor ", "descricao", "Powertrain"))
                        .session(login("gestor")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Motor"))
                .andExpect(jsonPath("$.ativo").value(false))
                .andExpect(jsonPath("$.lider").doesNotExist())
                .andReturn().getResponse().getContentAsString();
        long motor = ((Number) JsonPath.read(resposta, "$.id")).longValue();
        String cadastro = mvc.perform(json(post("/api/usuarios"), Map.of(
                        "nome", "Membro", "ra", "membro", "perfil", "MEMBRO", "subsistemaId", motor)).session(login("gestor")))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long membro = ((Number) JsonPath.read(cadastro, "$.usuario.id")).longValue();

        definirLider("gestor", motor, membro)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(true))
                .andExpect(jsonPath("$.lider.id").value(membro));

        assertThat(perfilNoBanco(membro)).isEqualTo("LIDER");
        assertThat(acoesAuditadas("SUBSISTEMA", motor)).containsExactly("CRIADO", "LIDER_DEFINIDO", "ATIVADO");
    }

    @Test
    void novoLiderVemDeOutroSubsistemaEOAnteriorVoltaAMembro() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, freios);

        definirLider("capitao", chassi, membro).andExpect(status().isOk());

        assertThat(perfilNoBanco(membro)).isEqualTo("LIDER");
        assertThat(subsistemaNoBanco(membro)).isEqualTo(chassi);
        assertThat(perfilNoBanco(liderChassi)).isEqualTo("MEMBRO");
        assertThat(subsistemaNoBanco(liderChassi)).isEqualTo(chassi);
        assertThat(acoesAuditadas("USUARIO", membro)).containsExactly("TRANSFERIDO", "PERFIL_ALTERADO");
    }

    @Test
    void liderEEscolhidoEntreOsMembrosAtivos() throws Exception {
        long orientador = usuario("orientador", Perfil.ORIENTADOR, chassi);
        long desativado = usuario("desativado", Perfil.MEMBRO, chassi, false);

        definirLider("capitao", chassi, orientador).andExpect(status().isUnprocessableContent());
        definirLider("capitao", chassi, desativado).andExpect(status().isUnprocessableContent());
        definirLider("capitao", chassi, id("liderfreios")).andExpect(status().isUnprocessableContent());
    }

    @Test
    void transferenciaDeIntegrante() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);

        receber("gestor", freios, membro).andExpect(status().isOk()).andExpect(jsonPath("$.subsistema.id").value(freios));
        receber("gestor", freios, membro).andExpect(status().isUnprocessableContent());
        receber("gestor", freios, liderChassi).andExpect(status().isUnprocessableContent());
        receber("capitao", freios, id("capitao")).andExpect(status().isUnprocessableContent());
        assertThat(acoesAuditadas("USUARIO", membro)).containsExactly("TRANSFERIDO");
    }

    @Test
    void desativacaoLevaTodosParaODestinoEOLiderComoMembro() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        long desativado = usuario("desativado", Perfil.MEMBRO, chassi, false);
        long motor = subsistema("Motor");

        desativar(chassi, Map.of()).andExpect(status().isUnprocessableContent());
        desativar(chassi, Map.of("destinoSubsistemaId", motor)).andExpect(status().isUnprocessableContent());
        desativar(chassi, Map.of("destinoSubsistemaId", chassi)).andExpect(status().isUnprocessableContent());
        desativar(chassi, Map.of("destinoSubsistemaId", freios))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false))
                .andExpect(jsonPath("$.lider").doesNotExist());

        assertThat(subsistemaNoBanco(membro)).isEqualTo(freios);
        assertThat(subsistemaNoBanco(desativado)).isEqualTo(freios);
        assertThat(subsistemaNoBanco(liderChassi)).isEqualTo(freios);
        assertThat(perfilNoBanco(liderChassi)).isEqualTo("MEMBRO");
        desativar(chassi, Map.of()).andExpect(status().isUnprocessableContent());
    }

    @Test
    void subsistemaDesativadoVoltaComNovaDefinicaoDeLider() throws Exception {
        desativar(chassi, Map.of("destinoSubsistemaId", freios)).andExpect(status().isOk());
        long membro = usuario("membro", Perfil.MEMBRO, freios);

        definirLider("capitao", chassi, membro).andExpect(status().isOk()).andExpect(jsonPath("$.ativo").value(true));
    }

    @Test
    void nomeDeSubsistemaEUnicoSemDiferenciarMaiusculas() throws Exception {
        mvc.perform(json(post("/api/subsistemas"), Map.of("nome", "CHASSI")).session(login("capitao")))
                .andExpect(status().isConflict());
        mvc.perform(json(put("/api/subsistemas/{id}", freios), Map.of("nome", "chassi")).session(login("capitao")))
                .andExpect(status().isConflict());
        mvc.perform(json(put("/api/subsistemas/{id}", chassi), Map.of("nome", "Chassi", "descricao", "Estrutura"))
                        .session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.descricao").value("Estrutura"));
    }

    @Test
    void membroVeSoAComposicaoDoProprioSubsistema() throws Exception {
        usuario("membro", Perfil.MEMBRO, chassi);
        MockHttpSession sessao = login("membro");

        mvc.perform(get("/api/subsistemas/{id}/integrantes", chassi).session(sessao))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].nome").value(containsInAnyOrder("liderchassi", "membro")));
        mvc.perform(get("/api/subsistemas/{id}/integrantes", freios).session(sessao)).andExpect(status().isForbidden());
        mvc.perform(get("/api/subsistemas").session(sessao))
                .andExpect(jsonPath("$[*].nome").value(containsInAnyOrder("Chassi", "Freios")))
                .andExpect(jsonPath("$[?(@.nome == 'Freios')].lider.nome").value(containsInAnyOrder("liderfreios")));
    }

    @Test
    void subsistemaDesativadoSoAparecePraQuemAdministra() throws Exception {
        long motor = subsistema("Motor");
        usuario("orientador", Perfil.ORIENTADOR, null);

        mvc.perform(get("/api/subsistemas/{id}", motor).session(login("orientador"))).andExpect(status().isNotFound());
        mvc.perform(get("/api/subsistemas").session(login("gestor")))
                .andExpect(jsonPath("$[*].nome").value(containsInAnyOrder("Chassi", "Freios", "Motor")));
    }

    @Test
    void soOOrientadorFicaSemSubsistema() throws Exception {
        long orientador = usuario("orientador", Perfil.ORIENTADOR, chassi);
        long membro = usuario("membro", Perfil.MEMBRO, chassi);

        retirar(chassi, membro).andExpect(status().isUnprocessableContent());
        retirar(freios, orientador).andExpect(status().isNotFound());
        retirar(chassi, orientador).andExpect(status().isOk()).andExpect(jsonPath("$.subsistema").doesNotExist());
        assertThat(subsistemaNoBanco(orientador)).isNull();
    }

    @Test
    void liderNaoAdministraSubsistemas() throws Exception {
        mvc.perform(json(post("/api/subsistemas"), Map.of("nome", "Motor")).session(login("liderchassi")))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/subsistemas/{id}/desativacao", chassi).with(csrf())
                        .contentType("application/json").content("{}").session(login("liderchassi")))
                .andExpect(status().isForbidden());
    }

    private ResultActions definirLider(String ra, long subsistema, long usuario) throws Exception {
        return mvc.perform(json(put("/api/subsistemas/{id}/lider", subsistema), Map.of("usuarioId", usuario))
                .session(login(ra)));
    }

    private ResultActions receber(String ra, long subsistema, long usuario) throws Exception {
        return mvc.perform(json(post("/api/subsistemas/{id}/integrantes", subsistema), Map.of("usuarioId", usuario))
                .session(login(ra)));
    }

    private ResultActions retirar(long subsistema, long usuario) throws Exception {
        return mvc.perform(delete("/api/subsistemas/{id}/integrantes/{usuarioId}", subsistema, usuario).with(csrf())
                .session(login("gestor")));
    }

    private ResultActions desativar(long subsistema, Map<String, ?> corpo) throws Exception {
        return mvc.perform(json(post("/api/subsistemas/{id}/desativacao", subsistema), corpo).session(login("capitao")));
    }

    private long id(String ra) {
        return jdbc.queryForObject("SELECT id FROM usuarios WHERE ra = ?", Long.class, ra);
    }
}
