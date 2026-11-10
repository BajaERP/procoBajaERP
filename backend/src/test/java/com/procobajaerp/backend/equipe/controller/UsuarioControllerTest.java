package com.procobajaerp.backend.equipe.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasLength;
import static org.hamcrest.Matchers.nullValue;
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
import org.springframework.test.web.servlet.ResultActions;

import com.jayway.jsonpath.JsonPath;
import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.equipe.domain.Perfil;

class UsuarioControllerTest extends TesteDeIntegracao {

    private long capitao;
    private long gestor;
    private long chassi;
    private long freios;

    @BeforeEach
    void equipe() {
        capitao = usuario("capitao", Perfil.CAPITAO_ADMIN, null);
        gestor = usuario("gestor", Perfil.GESTOR, null);
        chassi = subsistemaComLider("Chassi", "liderchassi");
        freios = subsistemaComLider("Freios", "liderfreios");
    }

    // Cadastro

    @Test
    void capitaoCadastraMembroQueEntraComASenhaProvisoria() throws Exception {
        String resposta = mvc.perform(json(post("/api/usuarios"), Map.of(
                        "nome", " Ana Souza ", "ra", " A2400001 ", "perfil", "MEMBRO", "subsistemaId", chassi))
                        .session(login("capitao")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuario.nome").value("Ana Souza"))
                .andExpect(jsonPath("$.usuario.ra").value("a2400001"))
                .andExpect(jsonPath("$.usuario.subsistema.nome").value("Chassi"))
                .andExpect(jsonPath("$.usuario.ativo").value(true))
                .andExpect(jsonPath("$.senhaProvisoria").value(hasLength(12)))
                .andReturn().getResponse().getContentAsString();

        String senha = JsonPath.read(resposta, "$.senhaProvisoria");
        long id = ((Number) JsonPath.read(resposta, "$.usuario.id")).longValue();
        mvc.perform(json(post("/api/auth/login"), Map.of("ra", "a2400001", "senha", senha))).andExpect(status().isOk());
        assertThat(acoesAuditadas("USUARIO", id)).containsExactly("CADASTRADO");
    }

    @Test
    void ninguemECadastradoComoLider() throws Exception {
        cadastrar("capitao", Map.of("nome", "Bia", "ra", "a2400002", "perfil", "LIDER", "subsistemaId", chassi))
                .andExpect(status().isUnprocessableContent());
    }

    @Test
    void membroPrecisaDeSubsistemaECapitaoNaoTemSubsistema() throws Exception {
        cadastrar("capitao", Map.of("nome", "Bia", "ra", "a2400002", "perfil", "MEMBRO"))
                .andExpect(status().isUnprocessableContent());
        cadastrar("capitao", Map.of("nome", "Bia", "ra", "a2400002", "perfil", "CAPITAO_ADMIN", "subsistemaId", chassi))
                .andExpect(status().isUnprocessableContent());
        cadastrar("capitao", Map.of("nome", "Bia", "ra", "a2400002", "perfil", "ORIENTADOR"))
                .andExpect(status().isCreated());
    }

    @Test
    void gestorNaoCadastraCapitaoNemGestor() throws Exception {
        cadastrar("gestor", Map.of("nome", "Bia", "ra", "a2400002", "perfil", "GESTOR"))
                .andExpect(status().isForbidden());
        cadastrar("gestor", Map.of("nome", "Bia", "ra", "a2400002", "perfil", "CAPITAO_ADMIN"))
                .andExpect(status().isForbidden());
    }

    @Test
    void membroNaoCadastraNinguem() throws Exception {
        usuario("membro", Perfil.MEMBRO, chassi);
        cadastrar("membro", Map.of("nome", "Bia", "ra", "a2400002", "perfil", "MEMBRO", "subsistemaId", chassi))
                .andExpect(status().isForbidden());
    }

    @Test
    void raDeUsuarioDesativadoSugereReativarEmVezDeCadastrar() throws Exception {
        long antigo = usuario("a2400003", Perfil.MEMBRO, chassi, false);
        usuario("a2400004", Perfil.MEMBRO, chassi);

        cadastrar("capitao", Map.of("nome", "Caio", "ra", "A2400003", "perfil", "MEMBRO", "subsistemaId", chassi))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.usuarioDesativado.id").value(antigo));
        cadastrar("capitao", Map.of("nome", "Caio", "ra", "a2400004", "perfil", "MEMBRO", "subsistemaId", chassi))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.usuarioDesativado").doesNotExist());
    }

    @Test
    void raInvalidoERecusado() throws Exception {
        cadastrar("capitao", Map.of("nome", "Caio", "ra", "a24-00003", "perfil", "ORIENTADOR"))
                .andExpect(status().isUnprocessableContent());
    }

    @Test
    void financeiroCadastradoPeloGestorAguardaOVinculoDesativado() throws Exception {
        cadastrar("gestor", Map.of("nome", "Fabi", "ra", "fin1", "perfil", "FINANCEIRO", "subsistemaId", freios))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuario.ativo").value(false));
        cadastrar("gestor", Map.of("nome", "Fabi", "ra", "fin2", "perfil", "FINANCEIRO", "subsistemaId", freios, "gestorId", gestor))
                .andExpect(status().isUnprocessableContent());
    }

    @Test
    void financeiroCadastradoPeloCapitaoJaNasceComVinculo() throws Exception {
        cadastrar("capitao", Map.of("nome", "Fabi", "ra", "fin1", "perfil", "FINANCEIRO", "subsistemaId", freios))
                .andExpect(status().isUnprocessableContent());
        String resposta = cadastrar("capitao", Map.of("nome", "Fabi", "ra", "fin1", "perfil", "FINANCEIRO", "subsistemaId", freios, "gestorId", gestor))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.usuario.ativo").value(true))
                .andReturn().getResponse().getContentAsString();

        long financeiro = ((Number) JsonPath.read(resposta, "$.usuario.id")).longValue();
        assertThat(gestorDoVinculo(financeiro)).isEqualTo(gestor);
    }

    // Troca de Perfil

    @Test
    void membroQueViraOrientadorContinuaNoSubsistema() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        trocarPerfil("gestor", membro, Map.of("perfil", "ORIENTADOR"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subsistema.id").value(chassi));
        assertThat(acoesAuditadas("USUARIO", membro)).containsExactly("PERFIL_ALTERADO");
    }

    @Test
    void quemViraCapitaoSaiDoSubsistema() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        trocarPerfil("capitao", membro, Map.of("perfil", "CAPITAO_ADMIN", "subsistemaId", chassi))
                .andExpect(status().isUnprocessableContent());
        trocarPerfil("capitao", membro, Map.of("perfil", "CAPITAO_ADMIN")).andExpect(status().isOk());
        assertThat(subsistemaNoBanco(membro)).isNull();
    }

    @Test
    void orientadorSemSubsistemaInformaUmAoVirarMembro() throws Exception {
        long orientador = usuario("orientador", Perfil.ORIENTADOR, null);
        trocarPerfil("gestor", orientador, Map.of("perfil", "MEMBRO")).andExpect(status().isUnprocessableContent());
        trocarPerfil("gestor", orientador, Map.of("perfil", "MEMBRO", "subsistemaId", freios)).andExpect(status().isOk());
        assertThat(subsistemaNoBanco(orientador)).isEqualTo(freios);
    }

    @Test
    void mudarDeSubsistemaNaTrocaDePerfilERecusado() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        trocarPerfil("gestor", membro, Map.of("perfil", "ORIENTADOR", "subsistemaId", freios))
                .andExpect(status().isUnprocessableContent());
    }

    @Test
    void perfilLiderSoMudaPelaDefinicaoDeLider() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        long lider = jdbc.queryForObject("SELECT id FROM usuarios WHERE ra = 'liderchassi'", Long.class);
        trocarPerfil("capitao", membro, Map.of("perfil", "LIDER")).andExpect(status().isUnprocessableContent());
        trocarPerfil("capitao", lider, Map.of("perfil", "MEMBRO")).andExpect(status().isUnprocessableContent());
    }

    @Test
    void ninguemTrocaOProprioPerfil() throws Exception {
        trocarPerfil("gestor", gestor, Map.of("perfil", "ORIENTADOR")).andExpect(status().isUnprocessableContent());
    }

    @Test
    void gestorNaoMexeEmGestor() throws Exception {
        long outro = usuario("gestor2", Perfil.GESTOR, null);
        trocarPerfil("gestor", outro, Map.of("perfil", "ORIENTADOR")).andExpect(status().isForbidden());
    }

    @Test
    void gestorComVinculosNaoTrocaDePerfilAntesDaTransferencia() throws Exception {
        long financeiro = usuario("fin1", Perfil.FINANCEIRO, null);
        vinculo(financeiro, gestor, capitao);
        trocarPerfil("capitao", gestor, Map.of("perfil", "ORIENTADOR"))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.financeiros[0].id").value(financeiro));
    }

    @Test
    void financeiroQueTrocaDePerfilPerdeOVinculo() throws Exception {
        long financeiro = usuario("fin1", Perfil.FINANCEIRO, null);
        vinculo(financeiro, gestor, capitao);
        trocarPerfil("capitao", financeiro, Map.of("perfil", "ORIENTADOR")).andExpect(status().isOk());

        assertThat(gestorDoVinculo(financeiro)).isNull();
        assertThat(acoesAuditadas("VINCULO_FINANCEIRO_GESTOR", financeiro)).containsExactly("ENCERRADO");
    }

    @Test
    void quemOGestorTornaFinanceiroFicaDesativadoAteOVinculo() throws Exception {
        long orientador = usuario("orientador", Perfil.ORIENTADOR, freios);
        trocarPerfil("gestor", orientador, Map.of("perfil", "FINANCEIRO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false));
    }

    @Test
    void capitaoTornaFinanceiroInformandoOGestor() throws Exception {
        long orientador = usuario("orientador", Perfil.ORIENTADOR, freios);
        trocarPerfil("capitao", orientador, Map.of("perfil", "FINANCEIRO", "gestorId", gestor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(true));
        assertThat(gestorDoVinculo(orientador)).isEqualTo(gestor);
    }

    // Desativação e reativação

    @Test
    void desativadoSomeParaQuemNaoAdministraAEquipe() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        usuario("colega", Perfil.MEMBRO, chassi);
        usuario("orientador", Perfil.ORIENTADOR, null);

        mvc.perform(post("/api/usuarios/{id}/desativacao", membro).with(csrf()).session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false));

        mvc.perform(get("/api/usuarios/{id}", membro).session(login("colega"))).andExpect(status().isNotFound());
        mvc.perform(get("/api/usuarios/{id}", membro).session(login("orientador"))).andExpect(status().isNotFound());
        mvc.perform(get("/api/usuarios/{id}", membro).session(login("gestor"))).andExpect(status().isOk());
        assertThat(acoesAuditadas("USUARIO", membro)).containsExactly("DESATIVADO");
    }

    @Test
    void liderSoSaiDepoisDeOutroSerDefinido() throws Exception {
        long lider = jdbc.queryForObject("SELECT id FROM usuarios WHERE ra = 'liderchassi'", Long.class);
        mvc.perform(post("/api/usuarios/{id}/desativacao", lider).with(csrf()).session(login("capitao")))
                .andExpect(status().isUnprocessableContent());
    }

    @Test
    void ninguemDesativaASiMesmo() throws Exception {
        mvc.perform(post("/api/usuarios/{id}/desativacao", capitao).with(csrf()).session(login("capitao")))
                .andExpect(status().isUnprocessableContent());
    }

    @Test
    void gestorComVinculosNaoEDesativado() throws Exception {
        vinculo(usuario("fin1", Perfil.FINANCEIRO, null), gestor, capitao);
        mvc.perform(post("/api/usuarios/{id}/desativacao", gestor).with(csrf()).session(login("capitao")))
                .andExpect(status().isUnprocessableContent());
    }

    @Test
    void reativaQuemFoiDesativado() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi, false);
        mvc.perform(post("/api/usuarios/{id}/reativacao", membro).with(csrf()).session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(true));
        mvc.perform(post("/api/usuarios/{id}/reativacao", membro).with(csrf()).session(login("gestor")))
                .andExpect(status().isUnprocessableContent());
    }

    @Test
    void financeiroSemVinculoNaoEReativado() throws Exception {
        long financeiro = usuario("fin1", Perfil.FINANCEIRO, null, false);
        mvc.perform(post("/api/usuarios/{id}/reativacao", financeiro).with(csrf()).session(login("capitao")))
                .andExpect(status().isUnprocessableContent());
    }

    // Visibilidade

    @Test
    void membroVeSoOProprioSubsistemaESemORaDosOutros() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        long colega = usuario("colega", Perfil.MEMBRO, chassi);
        long deFreios = usuario("defreios", Perfil.MEMBRO, freios);
        MockHttpSession sessao = login("membro");

        mvc.perform(get("/api/usuarios").session(sessao))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].nome").value(containsInAnyOrder("colega", "liderchassi", "membro")));
        mvc.perform(get("/api/usuarios/{id}", colega).session(sessao))
                .andExpect(jsonPath("$.ra").value(nullValue()));
        mvc.perform(get("/api/usuarios/{id}", membro).session(sessao))
                .andExpect(jsonPath("$.ra").value("membro"));
        mvc.perform(get("/api/usuarios/{id}", deFreios).session(sessao)).andExpect(status().isNotFound());
    }

    @Test
    void orientadorVeTodaAEquipeSemRa() throws Exception {
        usuario("orientador", Perfil.ORIENTADOR, null);
        usuario("desativado", Perfil.MEMBRO, freios, false);

        mvc.perform(get("/api/usuarios").session(login("orientador")))
                .andExpect(jsonPath("$[*].nome").value(containsInAnyOrder(
                        "capitao", "gestor", "liderchassi", "liderfreios", "orientador")))
                .andExpect(jsonPath("$[?(@.nome == 'gestor')].ra").value(containsInAnyOrder(nullValue())));
    }

    @Test
    void gestorFiltraPorSubsistemaPerfilEAtivo() throws Exception {
        usuario("membro", Perfil.MEMBRO, chassi);
        usuario("desativado", Perfil.MEMBRO, chassi, false);

        mvc.perform(get("/api/usuarios").param("subsistemaId", String.valueOf(chassi)).param("perfil", "MEMBRO")
                        .session(login("gestor")))
                .andExpect(jsonPath("$[*].nome").value(containsInAnyOrder("desativado", "membro")))
                .andExpect(jsonPath("$[0].ra").value("desativado"));
        mvc.perform(get("/api/usuarios").param("subsistemaId", String.valueOf(chassi)).param("ativo", "false")
                        .session(login("gestor")))
                .andExpect(jsonPath("$[*].nome").value(containsInAnyOrder("desativado")));
    }

    // Correção de Nome e RA, e Senha provisória

    @Test
    void gestorCorrigeNomeERaEAAuditoriaGuardaOAnterior() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        mvc.perform(json(put("/api/usuarios/{id}", membro), Map.of("nome", "Maria Membro", "ra", "A2400009"))
                        .session(login("gestor")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ra").value("a2400009"));

        String detalhes = jdbc.queryForObject(
                "SELECT detalhes_json::text FROM logs_auditoria WHERE entidade = 'USUARIO' AND registro_id = ? AND acao = 'EDITADO'",
                String.class, membro);
        assertThat(detalhes).contains("\"raAnterior\": \"membro\"", "\"ra\": \"a2400009\"");
    }

    @Test
    void correcaoRecusaRaEmUsoEOProprioUsuario() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        mvc.perform(json(put("/api/usuarios/{id}", membro), Map.of("nome", "Membro", "ra", "gestor")).session(login("gestor")))
                .andExpect(status().isConflict());
        mvc.perform(json(put("/api/usuarios/{id}", gestor), Map.of("nome", "Outro Nome", "ra", "gestor")).session(login("gestor")))
                .andExpect(status().isUnprocessableContent());
        mvc.perform(json(put("/api/usuarios/{id}", capitao), Map.of("nome", "Outro Nome", "ra", "capitao")).session(login("gestor")))
                .andExpect(status().isForbidden());
    }

    @Test
    void senhaProvisoriaSubstituiASenhaAnterior() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        String resposta = mvc.perform(post("/api/usuarios/{id}/senha-provisoria", membro).with(csrf())
                        .session(login("gestor")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String senha = JsonPath.read(resposta, "$.senhaProvisoria");
        mvc.perform(json(post("/api/auth/login"), Map.of("ra", "membro", "senha", SENHA))).andExpect(status().isUnauthorized());
        mvc.perform(json(post("/api/auth/login"), Map.of("ra", "membro", "senha", senha))).andExpect(status().isOk());
        assertThat(acoesAuditadas("USUARIO", membro)).containsExactly("SENHA_REDEFINIDA");
    }

    private ResultActions cadastrar(String ra, Map<String, ?> corpo) throws Exception {
        return mvc.perform(json(post("/api/usuarios"), corpo).session(login(ra)));
    }

    private ResultActions trocarPerfil(String ra, long id, Map<String, ?> corpo)
            throws Exception {
        return mvc.perform(json(put("/api/usuarios/{id}/perfil", id), corpo).session(login(ra)));
    }

    private Long gestorDoVinculo(long financeiro) {
        return jdbc.query("SELECT gestor_usuario_id FROM vinculos_financeiro_gestor WHERE financeiro_usuario_id = ?",
                rs -> rs.next() ? rs.getLong(1) : null, financeiro);
    }
}
