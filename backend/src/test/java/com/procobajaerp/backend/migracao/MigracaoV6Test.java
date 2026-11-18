package com.procobajaerp.backend.migracao;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.FlywayException;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import com.procobajaerp.backend.BancoDeTeste;

/** A V6 troca o Perfil Financeiro pela atribuição financeira de um Gestor, partindo de um banco na V5. */
class MigracaoV6Test {

    @Test
    void semFinanceirosRemoveOPerfilENaoAtribuiANinguem() {
        DataSource banco = BancoDeTeste.bancoVazio("migracao_v6_sem_financeiros");
        migrarAte(banco, "5");
        JdbcTemplate jdbc = new JdbcTemplate(banco);
        inserirUsuario(jdbc, "gestor", "GESTOR");

        migrarAte(banco, "6");

        assertThat(jdbc.queryForList("SELECT nome FROM perfis ORDER BY id", String.class))
                .containsExactly("CAPITAO_ADMIN", "GESTOR", "LIDER", "MEMBRO", "ORIENTADOR");
        assertThat(jdbc.queryForObject("SELECT count(*) FROM atribuicao_financeira", Integer.class)).isZero();
        assertThat(jdbc.queryForObject("SELECT to_regclass('vinculos_financeiro_gestor') IS NULL", Boolean.class)).isTrue();
        assertThat(jdbc.queryForList("""
                SELECT pm.codigo FROM perfil_permissoes pp
                JOIN perfis pe ON pe.id = pp.perfil_id JOIN permissoes pm ON pm.id = pp.permissao_id
                WHERE pe.nome = 'CAPITAO_ADMIN' ORDER BY pm.codigo""", String.class))
                .containsExactly("ATRIBUICAO_FINANCEIRA_GERENCIAR", "EQUIPE_CONSULTAR", "SUBSISTEMAS_GERENCIAR",
                        "USUARIOS_GERENCIAR");
        assertThat(jdbc.queryForList("SELECT unnest(enum_range(NULL::papel_aprovador))::text", String.class))
                .containsExactly("CAPITAO", "GESTOR_FINANCEIRO");
    }

    @Test
    void comUsuarioFinanceiroFalhaSemAlterarNada() {
        DataSource banco = BancoDeTeste.bancoVazio("migracao_v6_com_financeiro");
        migrarAte(banco, "5");
        JdbcTemplate jdbc = new JdbcTemplate(banco);
        inserirUsuario(jdbc, "fin1", "FINANCEIRO");

        assertThatThrownBy(() -> migrarAte(banco, "6"))
                .isInstanceOf(FlywayException.class)
                .hasMessageContaining("FINANCEIRO perfil");

        assertThat(jdbc.queryForObject("SELECT count(*) FROM perfis WHERE nome = 'FINANCEIRO'", Integer.class)).isOne();
        assertThat(jdbc.queryForObject("SELECT to_regclass('vinculos_financeiro_gestor') IS NOT NULL", Boolean.class))
                .isTrue();
        assertThat(jdbc.queryForObject("SELECT to_regclass('atribuicao_financeira') IS NULL", Boolean.class)).isTrue();
    }

    private static void migrarAte(DataSource banco, String versao) {
        Flyway.configure().dataSource(banco).target(versao).load().migrate();
    }

    private static void inserirUsuario(JdbcTemplate jdbc, String ra, String perfil) {
        jdbc.update("INSERT INTO usuarios (ra, nome, senha_hash, perfil_id) VALUES (?, ?, 'hash', "
                + "(SELECT id FROM perfis WHERE nome = ?))", ra, ra, perfil);
    }
}
