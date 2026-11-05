package com.procobajaerp.backend.seguranca.controller;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;

import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Senha;

class AutenticacaoControllerTest extends TesteDeIntegracao {

    @Test
    void loginAbreSessaoComPerfilEPermissoes() throws Exception {
        long subsistema = subsistemaComLider("Chassi", "lider1");
        usuario("a2412345", Perfil.MEMBRO, subsistema);

        MockHttpSession sessao = (MockHttpSession) mvc.perform(json(post("/api/auth/login"),
                        Map.of("ra", "  A2412345 ", "senha", SENHA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.perfil").value("MEMBRO"))
                .andExpect(jsonPath("$.subsistema.nome").value("Chassi"))
                .andExpect(jsonPath("$.permissoes").value(hasItem("EQUIPE_CONSULTAR")))
                .andReturn().getRequest().getSession();

        mvc.perform(get("/api/auth/eu").session(sessao))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ra").value("a2412345"));
    }

    @Test
    void senhaErradaRaInexistenteEUsuarioDesativadoRecebemAMesmaResposta() throws Exception {
        usuario("ativo", Perfil.ORIENTADOR, null);
        usuario("desativado", Perfil.ORIENTADOR, null, false);

        for (Map<String, String> credenciais : new Map[] {
                Map.of("ra", "ativo", "senha", "errada-123"),
                Map.of("ra", "naoexiste", "senha", SENHA),
                Map.of("ra", "desativado", "senha", SENHA)}) {
            mvc.perform(json(post("/api/auth/login"), credenciais))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.detail").value("RA ou senha inválidos."));
        }
    }

    @Test
    void sextaTentativaEmQuinzeMinutosERecusadaMesmoComASenhaCerta() throws Exception {
        usuario("limite1", Perfil.ORIENTADOR, null);
        for (int i = 0; i < 5; i++) {
            mvc.perform(json(post("/api/auth/login"), Map.of("ra", "limite1", "senha", "errada-123")))
                    .andExpect(status().isUnauthorized());
        }
        mvc.perform(json(post("/api/auth/login"), Map.of("ra", "limite1", "senha", SENHA)))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void apiExigeLogin() throws Exception {
        mvc.perform(get("/api/auth/eu")).andExpect(status().isUnauthorized());
    }

    @Test
    void alteracaoSemTokenCsrfERecusada() throws Exception {
        usuario("orientador", Perfil.ORIENTADOR, null);
        MockHttpSession sessao = login("orientador");
        mvc.perform(put("/api/auth/senha").session(sessao).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"senhaAtual\":\"" + SENHA + "\",\"novaSenha\":\"nova-senha-1\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void usuarioDesativadoPerdeASessaoNaRequisicaoSeguinte() throws Exception {
        long orientador = usuario("orientador", Perfil.ORIENTADOR, null);
        MockHttpSession sessao = login("orientador");
        jdbc.update("UPDATE usuarios SET ativo = false WHERE id = ?", orientador);

        mvc.perform(get("/api/auth/eu").session(sessao)).andExpect(status().isUnauthorized());
    }

    @Test
    void trocaDePerfilValeNaRequisicaoSeguinte() throws Exception {
        long gestor = usuario("gestor", Perfil.GESTOR, null);
        MockHttpSession sessao = login("gestor");
        mvc.perform(get("/api/auth/eu").session(sessao))
                .andExpect(jsonPath("$.permissoes").value(hasItem("USUARIOS_GERENCIAR")));
        jdbc.update("UPDATE usuarios SET perfil_id = (SELECT id FROM perfis WHERE nome = 'ORIENTADOR') WHERE id = ?", gestor);

        mvc.perform(get("/api/auth/eu").session(sessao))
                .andExpect(jsonPath("$.perfil").value("ORIENTADOR"))
                .andExpect(jsonPath("$.permissoes").value(not(hasItem("USUARIOS_GERENCIAR"))));
    }

    @Test
    void trocaAPropriaSenhaConfirmandoAAtual() throws Exception {
        usuario("orientador", Perfil.ORIENTADOR, null);
        MockHttpSession sessao = login("orientador");

        mvc.perform(json(put("/api/auth/senha"), Map.of("senhaAtual", "errada-123", "novaSenha", "nova-senha-1")).session(sessao))
                .andExpect(status().isUnprocessableContent());
        mvc.perform(json(put("/api/auth/senha"), Map.of("senhaAtual", SENHA, "novaSenha", "curta")).session(sessao))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erros.novaSenha").value("A nova senha deve ter de 8 a 64 caracteres."));
        mvc.perform(json(put("/api/auth/senha"), Map.of("senhaAtual", SENHA, "novaSenha", "nova-senha-1")).session(sessao))
                .andExpect(status().isNoContent());

        mvc.perform(json(post("/api/auth/login"), Map.of("ra", "orientador", "senha", "nova-senha-1")))
                .andExpect(status().isOk());
    }

    /** O BCrypt só aceita 72 bytes: 40 letras acentuadas cabem nos 64 caracteres, mas não no hash. */
    @Test
    void senhaAcentuadaQueNaoCabeNoHashERecusadaComMensagem() throws Exception {
        usuario("orientador", Perfil.ORIENTADOR, null);
        MockHttpSession sessao = login("orientador");

        mvc.perform(json(put("/api/auth/senha"), Map.of("senhaAtual", SENHA, "novaSenha", "ç".repeat(40))).session(sessao))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.detail").value(Senha.LONGA_DEMAIS));
    }

    @Test
    void logoutEncerraASessao() throws Exception {
        usuario("orientador", Perfil.ORIENTADOR, null);
        MockHttpSession sessao = login("orientador");

        mvc.perform(post("/api/auth/logout").with(csrf()).session(sessao)).andExpect(status().isNoContent());
        mvc.perform(get("/api/auth/eu").session(sessao)).andExpect(status().isUnauthorized());
    }
}
