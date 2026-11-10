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
import org.springframework.test.web.servlet.ResultActions;

import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.equipe.domain.Perfil;

class VinculoControllerTest extends TesteDeIntegracao {

    private long capitao;
    private long gestor;
    private long outroGestor;

    @BeforeEach
    void equipe() {
        capitao = usuario("capitao", Perfil.CAPITAO_ADMIN, null);
        gestor = usuario("gestor", Perfil.GESTOR, null);
        outroGestor = usuario("gestor2", Perfil.GESTOR, null);
    }

    @Test
    void primeiroVinculoAtivaOFinanceiroQueAguardava() throws Exception {
        long financeiro = usuario("fin1", Perfil.FINANCEIRO, null, false);

        definir(financeiro, gestor)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.financeiroAtivo").value(true))
                .andExpect(jsonPath("$.gestor.id").value(gestor));

        assertThat(ativoNoBanco(financeiro)).isTrue();
        assertThat(acoesAuditadas("VINCULO_FINANCEIRO_GESTOR", financeiro)).containsExactly("DEFINIDO");
        assertThat(acoesAuditadas("USUARIO", financeiro)).containsExactly("REATIVADO");
    }

    @Test
    void trocarOGestorDoVinculo() throws Exception {
        long financeiro = usuario("fin1", Perfil.FINANCEIRO, null);
        vinculo(financeiro, gestor, capitao);

        definir(financeiro, outroGestor).andExpect(status().isOk()).andExpect(jsonPath("$.gestor.id").value(outroGestor));
        definir(financeiro, outroGestor).andExpect(status().isOk());
        assertThat(acoesAuditadas("VINCULO_FINANCEIRO_GESTOR", financeiro)).containsExactly("ALTERADO");
    }

    @Test
    void vinculoSoEntreFinanceiroEGestorAtivo() throws Exception {
        long financeiro = usuario("fin1", Perfil.FINANCEIRO, null, false);
        long orientador = usuario("orientador", Perfil.ORIENTADOR, null);
        long gestorDesativado = usuario("gestor3", Perfil.GESTOR, null, false);

        definir(financeiro, orientador).andExpect(status().isUnprocessableContent());
        definir(financeiro, gestorDesativado).andExpect(status().isUnprocessableContent());
        definir(orientador, gestor).andExpect(status().isUnprocessableContent());
    }

    @Test
    void removerOVinculoDesativaOFinanceiro() throws Exception {
        long financeiro = usuario("fin1", Perfil.FINANCEIRO, null);
        vinculo(financeiro, gestor, capitao);

        mvc.perform(delete("/api/vinculos/{id}", financeiro).with(csrf()).session(login("capitao")))
                .andExpect(status().isNoContent());
        mvc.perform(delete("/api/vinculos/{id}", financeiro).with(csrf()).session(login("capitao")))
                .andExpect(status().isNotFound());

        assertThat(ativoNoBanco(financeiro)).isFalse();
        mvc.perform(json(post("/api/auth/login"), Map.of("ra", "fin1", "senha", SENHA))).andExpect(status().isUnauthorized());
    }

    @Test
    void transferenciaLiberaATrocaDePerfilDoGestor() throws Exception {
        long fin1 = usuario("fin1", Perfil.FINANCEIRO, null);
        long fin2 = usuario("fin2", Perfil.FINANCEIRO, null);
        vinculo(fin1, gestor, capitao);
        vinculo(fin2, gestor, capitao);

        mvc.perform(json(put("/api/usuarios/{id}/perfil", gestor), Map.of("perfil", "ORIENTADOR")).session(login("capitao")))
                .andExpect(status().isUnprocessableContent());
        mvc.perform(json(post("/api/vinculos/transferencia"), Map.of("gestorOrigemId", gestor, "gestorDestinoId", outroGestor))
                        .session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].financeiro.nome").value(containsInAnyOrder("fin1", "fin2")));
        mvc.perform(json(post("/api/vinculos/transferencia"), Map.of("gestorOrigemId", gestor, "gestorDestinoId", outroGestor))
                        .session(login("capitao")))
                .andExpect(status().isUnprocessableContent());
        mvc.perform(json(put("/api/usuarios/{id}/perfil", gestor), Map.of("perfil", "ORIENTADOR")).session(login("capitao")))
                .andExpect(status().isOk());
    }

    @Test
    void soOCapitaoMantemVinculos() throws Exception {
        long financeiro = usuario("fin1", Perfil.FINANCEIRO, null);
        vinculo(financeiro, gestor, capitao);
        mvc.perform(json(put("/api/vinculos/{id}", financeiro), Map.of("gestorId", outroGestor)).session(login("gestor")))
                .andExpect(status().isForbidden());
        mvc.perform(json(put("/api/vinculos/{id}", financeiro), Map.of("gestorId", outroGestor)).session(login("fin1")))
                .andExpect(status().isForbidden());
        mvc.perform(delete("/api/vinculos/{id}", financeiro).with(csrf()).session(login("fin1")))
                .andExpect(status().isForbidden());
    }

    @Test
    void cadaPerfilVeOsVinculosQueLheCabem() throws Exception {
        long fin1 = usuario("fin1", Perfil.FINANCEIRO, null);
        long fin2 = usuario("fin2", Perfil.FINANCEIRO, null);
        vinculo(fin1, gestor, capitao);
        vinculo(fin2, outroGestor, capitao);
        usuario("orientador", Perfil.ORIENTADOR, null);

        mvc.perform(get("/api/vinculos").session(login("capitao")))
                .andExpect(jsonPath("$[*].financeiro.nome").value(containsInAnyOrder("fin1", "fin2")));
        mvc.perform(get("/api/vinculos").session(login("gestor")))
                .andExpect(jsonPath("$[*].financeiro.nome").value(containsInAnyOrder("fin1")));
        mvc.perform(get("/api/vinculos").session(login("fin2")))
                .andExpect(jsonPath("$[*].gestor.nome").value(containsInAnyOrder("gestor2")));
        mvc.perform(get("/api/vinculos").session(login("orientador"))).andExpect(status().isForbidden());
    }

    private ResultActions definir(long financeiro, long gestor) throws Exception {
        return mvc.perform(json(put("/api/vinculos/{id}", financeiro), Map.of("gestorId", gestor)).session(login("capitao")));
    }
}
