package com.procobajaerp.backend.equipe.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.equipe.domain.Perfil;

class SucessaoCapitaoControllerTest extends TesteDeIntegracao {

    private long capitao;
    private long chassi;
    private long freios;

    @BeforeEach
    void equipe() {
        capitao = usuario("capitao", Perfil.CAPITAO_ADMIN, null);
        usuario("gestor", Perfil.GESTOR, null);
        chassi = subsistemaComLider("Chassi", "liderchassi");
        freios = subsistemaComLider("Freios", "liderfreios");
    }

    @Test
    void sucessaoTransfereCapitaoEAlocaOAnteriorComoMembroNaMesmaTransacao() throws Exception {
        long sucessor = usuario("sucessor", Perfil.GESTOR, null);
        var sessaoCapitao = login("capitao");

        mvc.perform(json(post("/api/equipe/sucessao-capitao"), Map.of(
                        "sucessorId", sucessor, "subsistemaDestinoId", freios)).session(sessaoCapitao))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.capitaoAnterior.perfil").value("MEMBRO"))
                .andExpect(jsonPath("$.capitaoAnterior.subsistema.id").value(freios))
                .andExpect(jsonPath("$.capitaoAtual.perfil").value("CAPITAO_ADMIN"))
                .andExpect(jsonPath("$.capitaoAtual.subsistema").doesNotExist());

        assertThat(perfilNoBanco(capitao)).isEqualTo("MEMBRO");
        assertThat(subsistemaNoBanco(capitao)).isEqualTo(freios);
        assertThat(perfilNoBanco(sucessor)).isEqualTo("CAPITAO_ADMIN");
        assertThat(subsistemaNoBanco(sucessor)).isNull();
        assertThat(jdbc.queryForObject("SELECT count(*) FROM usuarios WHERE ativo AND perfil_id = "
                + "(SELECT id FROM perfis WHERE nome = 'CAPITAO_ADMIN')", Integer.class)).isOne();
        assertThat(acoesAuditadas("USUARIO", capitao)).containsExactly("PERFIL_ALTERADO", "TRANSFERIDO");
        assertThat(acoesAuditadas("USUARIO", sucessor)).containsExactly("PERFIL_ALTERADO");
        mvc.perform(get("/api/auth/eu").session(sessaoCapitao))
                .andExpect(jsonPath("$.perfil").value("MEMBRO"));
    }

    @Test
    void sucessorGestorFinanceiroPerdeAResponsabilidadeAoAssumirCapitao() throws Exception {
        long gestor = id("gestor");
        gestorFinanceiro(gestor, capitao);

        mvc.perform(get("/api/equipe/sucessao-capitao/opcoes").session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sucessores[0].gestorFinanceiro").value(true));

        mvc.perform(json(post("/api/equipe/sucessao-capitao"), Map.of(
                        "sucessorId", gestor, "subsistemaDestinoId", chassi)).session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.capitaoAtual.gestorFinanceiro").value(false));

        assertThat(subsistemaNoBanco(gestor)).isNull();
        assertThat(gestorFinanceiroNoBanco()).isNull();
    }

    @Test
    void apenasCapitaoPodeIniciarSucessao() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);

        mvc.perform(json(post("/api/equipe/sucessao-capitao"), Map.of(
                        "sucessorId", membro, "subsistemaDestinoId", freios)).session(login("gestor")))
                .andExpect(status().isForbidden());

        assertThat(perfilNoBanco(capitao)).isEqualTo("CAPITAO_ADMIN");
        assertThat(perfilNoBanco(membro)).isEqualTo("MEMBRO");
    }

    @Test
    void rejeitaSucessorInativoDeOutroPerfilEProprioCapitaoSemAlterarEstado() throws Exception {
        long membroInativo = usuario("membro-inativo", Perfil.MEMBRO, chassi, false);
        long orientador = usuario("orientador", Perfil.ORIENTADOR, null);

        sucessao(membroInativo, freios).andExpect(status().isUnprocessableContent());
        sucessao(orientador, freios).andExpect(status().isUnprocessableContent());
        sucessao(capitao, freios).andExpect(status().isUnprocessableContent());
        long financeiro = jdbc.queryForObject("SELECT id FROM subsistemas WHERE nome = 'Financeiro'", Long.class);
        sucessao(id("gestor"), financeiro).andExpect(status().isUnprocessableContent());
        sucessao(id("gestor"), 999_999).andExpect(status().isNotFound());

        assertThat(perfilNoBanco(capitao)).isEqualTo("CAPITAO_ADMIN");
        assertThat(perfilNoBanco(id("gestor"))).isEqualTo("GESTOR");
        assertThat(ativoNoBanco(membroInativo)).isFalse();
        assertThat(acoesAuditadas("USUARIO", capitao)).isEmpty();
    }

    @Test
    void respostaListaSucessoresPermitidosSemMostrarIdentificadores() throws Exception {
        long membro = usuario("membro", Perfil.MEMBRO, chassi);
        long inativo = usuario("inativo", Perfil.MEMBRO, chassi, false);
        usuario("orientador", Perfil.ORIENTADOR, null);

        mvc.perform(get("/api/equipe/sucessao-capitao/opcoes").session(login("capitao")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sucessores[*].id").value(org.hamcrest.Matchers.containsInAnyOrder(
                        (int) id("gestor"), (int) membro)))
                .andExpect(jsonPath("$.sucessores[*].ra").doesNotExist())
                .andExpect(jsonPath("$.subsistemasDestino[*].id").value(org.hamcrest.Matchers.containsInAnyOrder(
                        (int) chassi, (int) freios)));

        mvc.perform(get("/api/equipe/sucessao-capitao/opcoes").session(login("gestor")))
                .andExpect(status().isForbidden());
        assertThat(ativoNoBanco(inativo)).isFalse();
    }

    private org.springframework.test.web.servlet.ResultActions sucessao(long sucessor, long destino) throws Exception {
        return mvc.perform(json(post("/api/equipe/sucessao-capitao"), Map.of(
                "sucessorId", sucessor, "subsistemaDestinoId", destino)).session(login("capitao")));
    }

    private long id(String apelido) {
        return jdbc.queryForObject("SELECT id FROM usuarios WHERE ra = ?", Long.class, ra(apelido));
    }
}
