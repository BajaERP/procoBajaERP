package com.procobajaerp.backend.auditoria.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.equipe.domain.Perfil;

class AuditoriaControllerTest extends TesteDeIntegracao {

    private long capitao;
    private long gestor;
    private long chassi;
    private long freios;
    private long eletrica;
    private long membro;

    @BeforeEach
    void equipe() {
        capitao = usuario("capitao", Perfil.CAPITAO_ADMIN, null);
        gestor = usuario("gestor", Perfil.GESTOR, null);
        chassi = subsistemaComLider("Chassi", "liderchassi");
        freios = subsistemaComLider("Freios", "liderfreios");
        eletrica = subsistemaComLider("Elétrica", "lider-eletrica");
        membro = usuario("membro", Perfil.MEMBRO, chassi);
        jdbc.update("UPDATE usuarios SET subsistema_id = NULL WHERE id = ?", gestor);
    }

    @Test
    void soCapitaoGestorELiderConsultamAuditoria() throws Exception {
        mvc.perform(get("/api/equipe/auditoria").session(login("capitao")))
                .andExpect(status().isOk());
        mvc.perform(get("/api/equipe/auditoria").session(login("gestor")))
                .andExpect(status().isOk());
        mvc.perform(get("/api/equipe/auditoria").session(login("liderchassi")))
                .andExpect(status().isOk());
        mvc.perform(get("/api/equipe/auditoria").session(login("membro")))
                .andExpect(status().isForbidden());
        usuario("orientador", Perfil.ORIENTADOR, null);
        mvc.perform(get("/api/equipe/auditoria").session(login("orientador")))
                .andExpect(status().isForbidden());
    }

    @Test
    void liderVeEventosQueIncluemSeuSubsistemaMasNaoHistoricoAntigoOuDeOutros() throws Exception {
        evento("TRANSFERIDO", chassi, freios, "{\"ra\":\"RA_PRIVADO\",\"senha\":\"SEGREDO\"}");
        evento("CADASTRADO", null, null, "{\"ra\":\"RA_HISTORICO\"}");
        evento("TRANSFERIDO", eletrica, freios, "{}");
        evento("TRANSFERIDO", eletrica, chassi, "{}");

        mvc.perform(get("/api/equipe/auditoria").session(login("liderchassi")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.content[0].subsistemaDestino.id").value(chassi))
                .andExpect(jsonPath("$.content[1].subsistemaOrigem.id").value(chassi))
                .andExpect(jsonPath("$.content[*].detalhesJson").doesNotExist())
                .andExpect(jsonPath("$.content[*].ra").doesNotExist())
                .andExpect(jsonPath("$.content[*].senha").doesNotExist());

        mvc.perform(get("/api/equipe/auditoria").session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(4));
    }

    @Test
    void filtroEPaginacaoSaoAplicadosNoServidor() throws Exception {
        evento("CADASTRADO", null, null, "{}");
        evento("TRANSFERIDO", chassi, freios, "{}");
        evento("TRANSFERIDO", freios, eletrica, "{}");

        mvc.perform(get("/api/equipe/auditoria?page=0&size=1").session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(1))
                .andExpect(jsonPath("$.totalElements").value(3))
                .andExpect(jsonPath("$.totalPages").value(3))
                .andExpect(jsonPath("$.content.length()").value(1));

        mvc.perform(get("/api/equipe/auditoria?acao=transferido&size=25").session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.content[*].acao").value(
                        org.hamcrest.Matchers.everyItem(org.hamcrest.Matchers.is("TRANSFERIDO"))));

        mvc.perform(get("/api/equipe/auditoria?size=101").session(login("capitao")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void transferenciaRegistraOsEscoposDaOrigemEDoDestino() throws Exception {
        mvc.perform(json(post("/api/subsistemas/{id}/integrantes", freios),
                java.util.Map.of("usuarioId", membro)).session(login("gestor")))
                .andExpect(status().isOk());

        assertThat(jdbc.queryForObject("SELECT subsistema_origem_id FROM logs_auditoria "
                + "WHERE registro_id = ? AND acao = 'TRANSFERIDO' ORDER BY id DESC LIMIT 1",
                Long.class, membro)).isEqualTo(chassi);
        assertThat(jdbc.queryForObject("SELECT subsistema_destino_id FROM logs_auditoria "
                + "WHERE registro_id = ? AND acao = 'TRANSFERIDO' ORDER BY id DESC LIMIT 1",
                Long.class, membro)).isEqualTo(freios);
    }

    private void evento(String acao, Long origemId, Long destinoId, String detalhes) {
        jdbc.update("INSERT INTO logs_auditoria (ator_usuario_id, entidade, registro_id, acao, detalhes_json, "
                + "subsistema_origem_id, subsistema_destino_id) VALUES (?, 'USUARIO', ?, ?, ?::jsonb, ?, ?)",
                capitao, membro, acao, detalhes, origemId, destinoId);
    }
}
