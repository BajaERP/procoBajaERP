package com.procobajaerp.backend.seguranca.controller;

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
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.ResultActions;

import com.jayway.jsonpath.JsonPath;
import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.auditoria.service.AuditoriaService;
import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.domain.Ra;
import com.procobajaerp.backend.equipe.repository.PerfilRepository;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;
import com.procobajaerp.backend.equipe.service.CapitaoInicial;

/** RA numérico, troca obrigatória da Senha provisória e fim das sessões na redefinição (issue 07). */
@ExtendWith(OutputCaptureExtension.class)
class SenhaProvisoriaTest extends TesteDeIntegracao {

    private static final String RA_NOVO = "2400001";

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private PerfilRepository perfis;

    @Autowired
    private PasswordEncoder codificador;

    @Autowired
    private AuditoriaService auditoria;

    private long chassi;

    @BeforeEach
    void equipe() {
        usuario("capitao", Perfil.CAPITAO_ADMIN, null);
        chassi = subsistemaComLider("Chassi", "liderchassi");
    }

    @Test
    void recemCadastradoSoTrocaASenhaAntesDeUsarOsModulos() throws Exception {
        String provisoria = cadastrarMembro();

        MockHttpSession sessao = (MockHttpSession) entrar(RA_NOVO, provisoria)
                .andExpect(jsonPath("$.trocaDeSenhaPendente").value(true))
                .andReturn().getRequest().getSession();

        mvc.perform(get("/api/subsistemas").session(sessao))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.detail").value("Troque a senha provisória antes de acessar o ERP."))
                .andExpect(jsonPath("$.trocaDeSenhaPendente").value(true));
        mvc.perform(json(post("/api/usuarios"), Map.of("nome", "X", "ra", "2400002", "perfil", "MEMBRO")).session(sessao))
                .andExpect(status().isForbidden());
        mvc.perform(get("/api/auth/eu").session(sessao))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trocaDeSenhaPendente").value(true));

        mvc.perform(json(put("/api/auth/senha"), Map.of("senhaAtual", provisoria, "novaSenha", "minha-senha-1"))
                        .session(sessao))
                .andExpect(status().isNoContent());

        mvc.perform(get("/api/auth/eu").session(sessao)).andExpect(jsonPath("$.trocaDeSenhaPendente").value(false));
        mvc.perform(get("/api/subsistemas").session(sessao)).andExpect(status().isOk());
        entrar(RA_NOVO, provisoria).andExpect(status().isUnauthorized());
        entrar(RA_NOVO, "minha-senha-1").andExpect(jsonPath("$.trocaDeSenhaPendente").value(false));
    }

    @Test
    void comTrocaPendenteOLogoutContinuaLiberado() throws Exception {
        String provisoria = cadastrarMembro();
        MockHttpSession sessao = (MockHttpSession) entrar(RA_NOVO, provisoria).andReturn().getRequest().getSession();

        mvc.perform(post("/api/auth/logout").with(csrf()).session(sessao)).andExpect(status().isNoContent());
        mvc.perform(get("/api/auth/eu").session(sessao)).andExpect(status().isUnauthorized());
    }

    @Test
    void redefinicaoEncerraAsSessoesEASenhaAnteriorDeixaDeValer() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        MockHttpSession sessaoDoMembro = login("membro");
        MockHttpSession sessaoDoCapitao = login("capitao");

        String primeira = redefinir(membro, sessaoDoCapitao);

        mvc.perform(get("/api/auth/eu").session(sessaoDoMembro)).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/auth/eu").session(sessaoDoCapitao)).andExpect(status().isOk());
        entrar(ra("membro"), SENHA).andExpect(status().isUnauthorized());
        MockHttpSession comAPrimeira = (MockHttpSession) entrar(ra("membro"), primeira)
                .andExpect(jsonPath("$.trocaDeSenhaPendente").value(true))
                .andReturn().getRequest().getSession();

        String segunda = redefinir(membro, sessaoDoCapitao);

        mvc.perform(get("/api/auth/eu").session(comAPrimeira)).andExpect(status().isUnauthorized());
        entrar(ra("membro"), primeira).andExpect(status().isUnauthorized());
        entrar(ra("membro"), segunda).andExpect(jsonPath("$.trocaDeSenhaPendente").value(true));
    }

    @Test
    void trocarAPropriaSenhaMantemEstaSessaoEEncerraAsOutras() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        String provisoria = redefinir(membro, login("capitao"));
        MockHttpSession outra = (MockHttpSession) entrar(ra("membro"), provisoria).andReturn().getRequest().getSession();
        MockHttpSession sessao = (MockHttpSession) entrar(ra("membro"), provisoria).andReturn().getRequest().getSession();

        mvc.perform(json(put("/api/auth/senha"), Map.of("senhaAtual", provisoria, "novaSenha", "minha-senha-1"))
                        .session(sessao))
                .andExpect(status().isNoContent());

        mvc.perform(get("/api/subsistemas").session(sessao)).andExpect(status().isOk());
        mvc.perform(get("/api/auth/eu").session(sessao)).andExpect(jsonPath("$.trocaDeSenhaPendente").value(false));
        mvc.perform(get("/api/auth/eu").session(outra)).andExpect(status().isUnauthorized());
    }

    @Test
    void comTrocaPendenteAFalhaDeCsrfNaoPedeTrocaDeSenha() throws Exception {
        String provisoria = cadastrarMembro();
        MockHttpSession sessao = (MockHttpSession) entrar(RA_NOVO, provisoria).andReturn().getRequest().getSession();

        mvc.perform(put("/api/auth/senha").session(sessao).contentType("application/json")
                        .content("{\"senhaAtual\":\"" + provisoria + "\",\"novaSenha\":\"minha-senha-1\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.trocaDeSenhaPendente").doesNotExist());
    }

    @Test
    void capitaoInicialTambemPrecisaTrocarASenha() throws Exception {
        jdbc.update("TRUNCATE usuarios RESTART IDENTITY CASCADE");
        new CapitaoInicial(new CapitaoInicial.Propriedades("1234567", "Primeiro Capitão", "senha-inicial"),
                usuarios, perfis, codificador, auditoria).criarSeNecessario();

        MockHttpSession sessao = (MockHttpSession) entrar("1234567", "senha-inicial")
                .andExpect(jsonPath("$.trocaDeSenhaPendente").value(true))
                .andReturn().getRequest().getSession();
        mvc.perform(get("/api/usuarios").session(sessao)).andExpect(status().isForbidden());
    }

    @Test
    void loginCadastroECorrecaoRecusamLetrasESimbolosNoRa() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        for (String ra : new String[] {"a2400001", "2400001a", "24-00001", "ra.123"}) {
            mvc.perform(json(put("/api/usuarios/{id}", membro), Map.of("nome", "Membro", "ra", ra)).session(login("capitao")))
                    .andExpect(status().isUnprocessableContent())
                    .andExpect(jsonPath("$.detail").value(Ra.MENSAGEM_FORMATO_INVALIDO));
            entrar(ra, SENHA)
                    .andExpect(status().isUnprocessableContent())
                    .andExpect(jsonPath("$.detail").value(Ra.MENSAGEM_FORMATO_INVALIDO));
            mvc.perform(json(post("/api/usuarios"), Map.of("nome", "X", "ra", ra, "perfil", "ORIENTADOR"))
                            .session(login("capitao")))
                    .andExpect(status().isUnprocessableContent())
                    .andExpect(jsonPath("$.detail").value(Ra.MENSAGEM_FORMATO_INVALIDO));
        }
    }

    @Test
    void senhasNaoAparecemNosLogsNemNaAuditoria(CapturedOutput saida) throws Exception {
        String provisoria = cadastrarMembro();
        long novo = jdbc.queryForObject("SELECT id FROM usuarios WHERE ra = ?", Long.class, RA_NOVO);
        MockHttpSession sessao = (MockHttpSession) entrar(RA_NOVO, provisoria).andReturn().getRequest().getSession();
        mvc.perform(json(put("/api/auth/senha"), Map.of("senhaAtual", provisoria, "novaSenha", "minha-senha-1"))
                .session(sessao)).andExpect(status().isNoContent());
        String redefinida = redefinir(novo, login("capitao"));
        jdbc.update("UPDATE usuarios SET ativo = false WHERE perfil_id = (SELECT id FROM perfis WHERE nome = 'CAPITAO_ADMIN')");
        new CapitaoInicial(new CapitaoInicial.Propriedades("7654321", "Outro", "senha-do-capitao"),
                usuarios, perfis, codificador, auditoria).criarSeNecessario();

        String auditoriaInteira = String.join("\n", jdbc.queryForList(
                "SELECT coalesce(detalhes_json::text, '') FROM logs_auditoria", String.class));
        assertThat(usuarios.existsByRa("7654321")).isTrue();
        for (String senha : new String[] {provisoria, "minha-senha-1", redefinida, "senha-do-capitao", SENHA}) {
            assertThat(saida.getAll()).doesNotContain(senha);
            assertThat(auditoriaInteira).doesNotContain(senha);
        }
    }

    private String cadastrarMembro() throws Exception {
        String corpo = mvc.perform(json(post("/api/usuarios"),
                        Map.of("nome", "Novo", "ra", RA_NOVO, "perfil", "MEMBRO", "subsistemaId", chassi))
                        .session(login("capitao")))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(corpo, "$.senhaProvisoria");
    }

    private String redefinir(long usuario, MockHttpSession sessao) throws Exception {
        String corpo = mvc.perform(post("/api/usuarios/{id}/senha-provisoria", usuario).with(csrf()).session(sessao))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(corpo, "$.senhaProvisoria");
    }

    private ResultActions entrar(String ra, String senha) throws Exception {
        return mvc.perform(json(post("/api/auth/login"), Map.of("ra", ra, "senha", senha)));
    }
}
