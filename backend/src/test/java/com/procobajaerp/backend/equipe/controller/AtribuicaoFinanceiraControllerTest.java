package com.procobajaerp.backend.equipe.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpSession;

import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.equipe.domain.Perfil;

class AtribuicaoFinanceiraControllerTest extends TesteDeIntegracao {

    private long capitao;
    private long gestor;
    private long outroGestor;
    private long financeiro;
    private long chassi;

    @BeforeEach
    void equipe() {
        capitao = usuario("capitao", Perfil.CAPITAO_ADMIN, null);
        gestor = usuario("gestor", Perfil.GESTOR, null);
        outroGestor = usuario("gestor2", Perfil.GESTOR, null);
        financeiro = jdbc.queryForObject("SELECT id FROM subsistemas WHERE nome = 'Financeiro'", Long.class);
        chassi = subsistema("Chassi");
    }

    @Test
    void gestorAssociadoAoFinanceiroRecebeResponsabilidadeEPermissoesImediatamente() throws Exception {
        MockHttpSession sessaoGestor = login("gestor");

        mvc.perform(json(post("/api/subsistemas/{id}/integrantes", financeiro), Map.of("usuarioId", gestor))
                        .session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gestorFinanceiro").value(true))
                .andExpect(jsonPath("$.subsistema.nome").value("Financeiro"));
        mvc.perform(get("/api/auth/eu").session(sessaoGestor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gestorFinanceiro").value(true));
        mvc.perform(get("/api/atribuicao-financeira").session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gestor.id").value(gestor))
                .andExpect(jsonPath("$.atribuidaEm").doesNotExist());
        assertThat(gestorFinanceiroNoBanco()).isEqualTo(gestor);
        assertThat(perfilNoBanco(gestor)).isEqualTo("GESTOR");
    }

    @Test
    void transferirOGestorParaOutroSubsistemaDeixaAResponsabilidadeVaga() throws Exception {
        gestorFinanceiro(gestor, capitao);

        mvc.perform(json(post("/api/subsistemas/{id}/integrantes", chassi), Map.of("usuarioId", gestor))
                        .session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gestorFinanceiro").value(false));
        mvc.perform(get("/api/atribuicao-financeira").session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gestor").value(org.hamcrest.Matchers.nullValue()));
        assertThat(gestorFinanceiroNoBanco()).isNull();
    }

    @Test
    void desativarOGestorFinanceiroDeixaAResponsabilidadeVaga() throws Exception {
        gestorFinanceiro(gestor, capitao);

        mvc.perform(post("/api/usuarios/{id}/desativacao", gestor).with(csrf()).session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false))
                .andExpect(jsonPath("$.gestorFinanceiro").value(false));
        assertThat(gestorFinanceiroNoBanco()).isNull();
    }

    @Test
    void somenteUmGestorAtivoPodeFicarNoSubsistemaFinanceiro() throws Exception {
        gestorFinanceiro(gestor, capitao);

        mvc.perform(json(post("/api/subsistemas/{id}/integrantes", financeiro), Map.of("usuarioId", outroGestor))
                        .session(login("capitao")))
                .andExpect(status().isConflict());
        assertThat(subsistemaNoBanco(outroGestor)).isNull();
        assertThat(gestorFinanceiroNoBanco()).isEqualTo(gestor);
    }

    @Test
    void consultaDaResponsabilidadeFinanceiraUsaOGestorDoSubsistema() throws Exception {
        gestorFinanceiro(gestor, capitao);
        mvc.perform(get("/api/atribuicao-financeira").session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gestor.id").value(gestor));
        mvc.perform(get("/api/atribuicao-financeira").session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gestor.nome").value("gestor"));
    }

    @Test
    void endpointsDeConcessaoManualDeixamDeExistir() throws Exception {
        mvc.perform(json(put("/api/atribuicao-financeira"), Map.of("gestorId", gestor)).session(login("capitao")))
                .andExpect(status().isMethodNotAllowed());
        mvc.perform(post("/api/atribuicao-financeira").with(csrf()).session(login("capitao")))
                .andExpect(status().isMethodNotAllowed());
    }
}
