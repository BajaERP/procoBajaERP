package com.procobajaerp.backend.equipe.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import javax.sql.DataSource;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.ResultActions;

import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.equipe.domain.Perfil;

class AtribuicaoFinanceiraControllerTest extends TesteDeIntegracao {

    @Autowired
    private DataSource dataSource;

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
    void capitaoAtribuiAResponsabilidadeAUmGestorAtivo() throws Exception {
        atribuir(gestor)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gestor.id").value(gestor))
                .andExpect(jsonPath("$.atribuidaEm").exists());

        assertThat(gestorFinanceiroNoBanco()).isEqualTo(gestor);
        assertThat(perfilNoBanco(gestor)).isEqualTo("GESTOR");
        assertThat(acoesAuditadas("ATRIBUICAO_FINANCEIRA", gestor)).containsExactly("ATRIBUIDA");
    }

    @Test
    void transferirTrocaOResponsavelNumaSoOperacao() throws Exception {
        gestorFinanceiro(gestor, capitao);

        atribuir(outroGestor).andExpect(status().isOk()).andExpect(jsonPath("$.gestor.id").value(outroGestor));

        assertThat(gestorFinanceiroNoBanco()).isEqualTo(outroGestor);
        assertThat(jdbc.queryForObject("SELECT count(*) FROM atribuicao_financeira", Integer.class)).isOne();
        assertThat(acoesAuditadas("ATRIBUICAO_FINANCEIRA", outroGestor)).containsExactly("TRANSFERIDA");
    }

    @Test
    void atribuirDeNovoAoMesmoGestorERecusado() throws Exception {
        gestorFinanceiro(gestor, capitao);
        atribuir(gestor).andExpect(status().isUnprocessableContent());
    }

    @Test
    void soUmGestorAtivoRecebeAResponsabilidade() throws Exception {
        long desativado = usuario("gestor3", Perfil.GESTOR, null, false);
        long orientador = usuario("orientador", Perfil.ORIENTADOR, null);

        atribuir(desativado).andExpect(status().isUnprocessableContent());
        atribuir(orientador).andExpect(status().isUnprocessableContent());
        atribuir(capitao).andExpect(status().isUnprocessableContent());
        assertThat(gestorFinanceiroNoBanco()).isNull();
    }

    @Test
    void gestorDeSubsistemaInativoPodeReceberAResponsabilidade() throws Exception {
        long inativo = subsistema("Freios");
        long gestorDeFreios = usuario("gestor3", Perfil.GESTOR, inativo);
        atribuir(gestorDeFreios).andExpect(status().isOk());
    }

    @Test
    void capitaoRetiraAResponsabilidadeEAPosicaoFicaVaga() throws Exception {
        gestorFinanceiro(gestor, capitao);

        mvc.perform(delete("/api/atribuicao-financeira").with(csrf()).session(login("capitao")))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/atribuicao-financeira").session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gestor").value(nullValue()));
        mvc.perform(delete("/api/atribuicao-financeira").with(csrf()).session(login("capitao")))
                .andExpect(status().isUnprocessableContent());
        assertThat(acoesAuditadas("ATRIBUICAO_FINANCEIRA", gestor)).containsExactly("RETIRADA");
    }

    @Test
    void soOCapitaoAtribuiOuRetira() throws Exception {
        gestorFinanceiro(gestor, capitao);

        mvc.perform(json(put("/api/atribuicao-financeira"), Map.of("gestorId", outroGestor)).session(login("gestor")))
                .andExpect(status().isForbidden());
        mvc.perform(delete("/api/atribuicao-financeira").with(csrf()).session(login("gestor")))
                .andExpect(status().isForbidden());
        assertThat(gestorFinanceiroNoBanco()).isEqualTo(gestor);
    }

    @Test
    void quemVeOGestorConsultaQueEleEOGestorFinanceiro() throws Exception {
        long chassi = subsistemaComLider("Chassi", "lider");
        usuario("membro", Perfil.MEMBRO, chassi);
        long gestorDoChassi = usuario("gestor3", Perfil.GESTOR, chassi);
        gestorFinanceiro(gestorDoChassi, capitao);

        mvc.perform(get("/api/atribuicao-financeira").session(login("membro")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gestor.nome").value("gestor3"));
    }

    @Test
    void membroDeOutroSubsistemaNaoConsultaOGestorFinanceiro() throws Exception {
        long chassi = subsistemaComLider("Chassi", "lider");
        usuario("membro", Perfil.MEMBRO, chassi);

        mvc.perform(get("/api/atribuicao-financeira").session(login("membro")))
                .andExpect(status().isForbidden());

        gestorFinanceiro(gestor, capitao);
        mvc.perform(get("/api/atribuicao-financeira").session(login("membro")))
                .andExpect(status().isForbidden());
        mvc.perform(get("/api/atribuicao-financeira").session(login("gestor2")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gestor.id").value(gestor));
    }

    @Test
    void oBancoNaoAceitaDoisGestoresFinanceiros() {
        gestorFinanceiro(gestor, capitao);
        assertThatThrownBy(() -> jdbc.update(
                        "INSERT INTO atribuicao_financeira (id, gestor_usuario_id, atribuida_por_usuario_id) VALUES (2, ?, ?)",
                        outroGestor, capitao))
                .isInstanceOf(DataIntegrityViolationException.class);
        assertThatThrownBy(() -> gestorFinanceiro(outroGestor, capitao))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    // Concorrência: uma segunda conexão faz o papel de outra requisição, ainda sem commit.

    @Test
    void desativacaoQueEsperaUmaAtribuicaoAVeERecusa() throws Exception {
        MockHttpSession sessao = login("capitao");
        try (Connection outra = transacao()) {
            executar(outra, "SELECT id FROM usuarios WHERE id = " + gestor + " FOR UPDATE");
            executar(outra, "INSERT INTO atribuicao_financeira (gestor_usuario_id, atribuida_por_usuario_id) VALUES ("
                    + gestor + ", " + capitao + ")");
            CompletableFuture<MockHttpServletResponse> desativacao = emParalelo(
                    post("/api/usuarios/{id}/desativacao", gestor).with(csrf()).session(sessao));
            esperarRequisicaoBloqueada();
            outra.commit();

            assertThat(desativacao.get(10, TimeUnit.SECONDS).getStatus()).isEqualTo(422);
        }
        assertThat(ativoNoBanco(gestor)).isTrue();
    }

    @Test
    void atribuicaoQueEsperaUmaDesativacaoAVeERecusa() throws Exception {
        MockHttpSession sessao = login("capitao");
        try (Connection outra = transacao()) {
            executar(outra, "UPDATE usuarios SET ativo = false WHERE id = " + gestor);
            CompletableFuture<MockHttpServletResponse> atribuicao = emParalelo(
                    json(put("/api/atribuicao-financeira"), Map.of("gestorId", gestor)).session(sessao));
            esperarRequisicaoBloqueada();
            outra.commit();

            assertThat(atribuicao.get(10, TimeUnit.SECONDS).getStatus()).isEqualTo(422);
        }
        assertThat(gestorFinanceiroNoBanco()).isNull();
    }

    @Test
    void duasAtribuicoesComAPosicaoVagaViramAtribuicaoETransferencia() throws Exception {
        MockHttpSession sessao = login("capitao");
        try (Connection outra = transacao()) {
            executar(outra, "LOCK TABLE atribuicao_financeira IN EXCLUSIVE MODE");
            executar(outra, "INSERT INTO atribuicao_financeira (gestor_usuario_id, atribuida_por_usuario_id) VALUES ("
                    + gestor + ", " + capitao + ")");
            CompletableFuture<MockHttpServletResponse> atribuicao = emParalelo(
                    json(put("/api/atribuicao-financeira"), Map.of("gestorId", outroGestor)).session(sessao));
            esperarRequisicaoBloqueada();
            outra.commit();

            assertThat(atribuicao.get(10, TimeUnit.SECONDS).getStatus()).isEqualTo(200);
        }
        assertThat(gestorFinanceiroNoBanco()).isEqualTo(outroGestor);
        assertThat(acoesAuditadas("ATRIBUICAO_FINANCEIRA", outroGestor)).containsExactly("TRANSFERIDA");
    }

    private Connection transacao() throws SQLException {
        Connection conexao = dataSource.getConnection();
        conexao.setAutoCommit(false);
        return conexao;
    }

    private static void executar(Connection conexao, String sql) throws SQLException {
        try (Statement comando = conexao.createStatement()) {
            comando.execute(sql);
        }
    }

    private CompletableFuture<MockHttpServletResponse> emParalelo(RequestBuilder requisicao) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return mvc.perform(requisicao).andReturn().getResponse();
            } catch (Exception e) {
                throw new IllegalStateException(e);
            }
        });
    }

    /** Espera a requisição em paralelo ficar parada numa trava do banco. */
    private void esperarRequisicaoBloqueada() throws InterruptedException {
        Instant limite = Instant.now().plus(Duration.ofSeconds(10));
        while (jdbc.queryForObject("SELECT count(*) FROM pg_stat_activity WHERE wait_event_type = 'Lock'",
                Integer.class) == 0) {
            assertThat(Instant.now()).as("a requisição em paralelo deveria esperar a trava").isBefore(limite);
            Thread.sleep(20);
        }
    }

    private ResultActions atribuir(long gestorId) throws Exception {
        return mvc.perform(json(put("/api/atribuicao-financeira"), Map.of("gestorId", gestorId)).session(login("capitao")));
    }
}
