package com.procobajaerp.backend.equipe.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.startsWith;
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
    void desativacaoDistribuiCadaUmEntreSubsistemasAtivosEOLiderVaiComoMembro() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        long desativado = usuario("desativado", Perfil.MEMBRO, chassi, false);
        long suspensao = subsistemaComLider("Suspensão", "lidersuspensao");

        desativar(chassi, destinos(liderChassi, freios, membro, suspensao, desativado, freios))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false))
                .andExpect(jsonPath("$.lider").doesNotExist());

        assertThat(subsistemaNoBanco(liderChassi)).isEqualTo(freios);
        assertThat(perfilNoBanco(liderChassi)).isEqualTo("MEMBRO");
        assertThat(subsistemaNoBanco(membro)).isEqualTo(suspensao);
        assertThat(subsistemaNoBanco(desativado)).isEqualTo(freios);
        assertThat(acoesAuditadas("USUARIO", desativado)).containsExactly("TRANSFERIDO");
        assertThat(acoesAuditadas("USUARIO", membro)).containsExactly("TRANSFERIDO");
        assertThat(acoesAuditadas("USUARIO", liderChassi)).containsExactly("PERFIL_ALTERADO", "TRANSFERIDO");
        assertThat(acoesAuditadas("SUBSISTEMA", chassi)).contains("DESATIVADO");
        String detalhes = jdbc.queryForObject(
                "SELECT detalhes_json::text FROM logs_auditoria WHERE entidade = 'SUBSISTEMA' AND acao = 'DESATIVADO'", String.class);
        assertThat(detalhes).contains("\"usuariosTransferidos\": 3")
                .contains("{\"usuarioId\": " + membro + ", \"subsistemaId\": " + suspensao + "}");
        desativar(chassi, "{}").andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.detail").value("O Subsistema já está desativado."));
    }

    @Test
    void desativacaoExigeUmDestinoAtivoParaCadaUsuarioENadaMudaSeAlgumFalhar() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        long desativado = usuario("desativado", Perfil.MEMBRO, chassi, false);
        long motor = subsistema("Motor");
        long deFora = id("liderfreios");

        desativar(chassi, "{}").andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.semDestino[*].nome").value(containsInAnyOrder("desativado", "liderchassi", "membro")));
        desativar(chassi, destinos(liderChassi, freios, membro, freios)).andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.semDestino[*].id").value(containsInAnyOrder((int) desativado)));
        desativar(chassi, destinos(liderChassi, freios, membro, motor, desativado, freios))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.detail").value("O destino de membro precisa ser um Subsistema ativo."));
        desativar(chassi, destinos(liderChassi, freios, membro, chassi, desativado, freios))
                .andExpect(status().isUnprocessableContent());
        desativar(chassi, destinos(liderChassi, freios, membro, freios, desativado, freios, membro, freios))
                .andExpect(status().isUnprocessableContent());
        desativar(chassi, destinos(liderChassi, freios, membro, freios, desativado, freios, deFora, freios))
                .andExpect(status().isNotFound());
        desativar(chassi, destinos(liderChassi, freios, membro, 999_999, desativado, freios))
                .andExpect(status().isNotFound());
        desativar(chassi, "{\"destinos\":[{\"usuarioId\":" + membro + "}]}").andExpect(status().isBadRequest());

        assertThat(jdbc.queryForObject("SELECT ativo FROM subsistemas WHERE id = ?", Boolean.class, chassi)).isTrue();
        assertThat(perfilNoBanco(liderChassi)).isEqualTo("LIDER");
        assertThat(subsistemaNoBanco(membro)).isEqualTo(chassi);
        assertThat(subsistemaNoBanco(desativado)).isEqualTo(chassi);
        assertThat(acoesAuditadas("SUBSISTEMA", chassi)).doesNotContain("DESATIVADO");
    }

    @Test
    void semOutroSubsistemaAtivoSoOVazioPodeSerDesativado() throws Exception {
        long liderFreios = id("liderfreios");
        long motor = subsistema("Motor");
        desativar(freios, destinos(liderFreios, chassi)).andExpect(status().isOk());

        desativar(chassi, destinos(liderChassi, motor)).andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.detail").value(startsWith("Não há outro Subsistema ativo")));
        assertThat(perfilNoBanco(liderChassi)).isEqualTo("LIDER");

        mvc.perform(post("/api/subsistemas/{id}/desativacao", motor).with(csrf()).session(login("capitao")))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.detail").value("O Subsistema já está desativado."));
    }

    @Test
    void subsistemaDesativadoVoltaComNovaDefinicaoDeLider() throws Exception {
        desativar(chassi, destinos(liderChassi, freios)).andExpect(status().isOk());
        long membro = usuario("membro", Perfil.MEMBRO, freios);

        definirLider("capitao", chassi, membro).andExpect(status().isOk()).andExpect(jsonPath("$.ativo").value(true));
    }

    @Test
    void transferenciaComumParaSubsistemaInativo() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        long motor = subsistema("Motor");

        receber("gestor", motor, membro).andExpect(status().isOk());

        assertThat(subsistemaNoBanco(membro)).isEqualTo(motor);
    }

    @Test
    void quemPertenceASubsistemaInativoEntraEVeOProprioSubsistemaSemOsDesativados() throws Exception {
        long motor = subsistema("Motor");
        usuario("membro", Perfil.MEMBRO, motor);
        usuario("desativado", Perfil.MEMBRO, motor, false);
        usuario("orientador", Perfil.ORIENTADOR, motor);

        MockHttpSession sessao = login("membro");
        mvc.perform(get("/api/auth/eu").session(sessao))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subsistema.nome").value("Motor"));
        mvc.perform(get("/api/subsistemas/{id}", motor).session(sessao))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false));
        mvc.perform(get("/api/subsistemas/{id}/integrantes", motor).session(sessao))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].nome").value(containsInAnyOrder("membro", "orientador")))
                .andExpect(jsonPath("$[?(@.ra != null)].nome").value(containsInAnyOrder("membro")));
        mvc.perform(get("/api/subsistemas").session(sessao))
                .andExpect(jsonPath("$[*].nome").value(containsInAnyOrder("Chassi", "Freios", "Motor")));
        mvc.perform(get("/api/subsistemas/{id}/integrantes", motor).session(login("orientador")))
                .andExpect(jsonPath("$[*].nome").value(containsInAnyOrder("membro", "orientador")));

        mvc.perform(get("/api/subsistemas/{id}", motor).session(login("liderchassi"))).andExpect(status().isNotFound());
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
    void subsistemaDesativadoSoAparecePraQuemAdministraOuPertence() throws Exception {
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
        mvc.perform(post("/api/subsistemas/{id}/desativacao", chassi).with(csrf())
                        .contentType("application/json").content(destinos(liderChassi, freios)).session(login("liderchassi")))
                .andExpect(status().isForbidden());
        assertThat(perfilNoBanco(liderChassi)).isEqualTo("LIDER");
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

    private ResultActions desativar(long subsistema, String corpo) throws Exception {
        return mvc.perform(json(post("/api/subsistemas/{id}/desativacao", subsistema), corpo).session(login("capitao")));
    }

    /** Pares usuarioId, subsistemaId. */
    private static String destinos(long... pares) {
        StringBuilder json = new StringBuilder("{\"destinos\":[");
        for (int i = 0; i < pares.length; i += 2) {
            json.append(i == 0 ? "" : ",").append("{\"usuarioId\":").append(pares[i])
                    .append(",\"subsistemaId\":").append(pares[i + 1]).append('}');
        }
        return json.append("]}").toString();
    }

    private long id(String ra) {
        return jdbc.queryForObject("SELECT id FROM usuarios WHERE ra = ?", Long.class, ra);
    }
}
