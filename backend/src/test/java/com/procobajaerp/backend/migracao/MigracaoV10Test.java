package com.procobajaerp.backend.migracao;

import static org.assertj.core.api.Assertions.assertThat;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import com.procobajaerp.backend.BancoDeTeste;

/** A V10 adiciona os escopos de auditoria sem alterar os registros históricos. */
class MigracaoV10Test {

    @Test
    void preservaEventosAntigosSemEscopoEConcedeConsultaAosPerfisAutorizados() {
        DataSource banco = BancoDeTeste.bancoVazio("migracao_v10_escopo_auditoria");
        Flyway.configure().dataSource(banco).target("9").load().migrate();
        JdbcTemplate jdbc = new JdbcTemplate(banco);
        jdbc.update("INSERT INTO logs_auditoria (entidade, registro_id, acao) VALUES ('USUARIO', 1, 'CADASTRADO')");

        Flyway.configure().dataSource(banco).target("10").load().migrate();

        assertThat(jdbc.queryForObject("SELECT subsistema_origem_id FROM logs_auditoria LIMIT 1", Long.class))
                .isNull();
        assertThat(jdbc.queryForObject("SELECT subsistema_destino_id FROM logs_auditoria LIMIT 1", Long.class))
                .isNull();
        assertThat(jdbc.queryForObject("SELECT count(*) FROM perfil_permissoes pp "
                + "JOIN permissoes p ON p.id = pp.permissao_id "
                + "JOIN perfis pe ON pe.id = pp.perfil_id "
                + "WHERE p.codigo = 'AUDITORIA_CONSULTAR' AND pe.nome IN ('CAPITAO_ADMIN', 'GESTOR', 'LIDER')",
                Integer.class)).isEqualTo(3);
        assertThat(jdbc.queryForObject("SELECT count(*) FROM perfil_permissoes pp "
                + "JOIN permissoes p ON p.id = pp.permissao_id "
                + "WHERE p.codigo = 'AUDITORIA_CONSULTAR'", Integer.class)).isEqualTo(3);
    }
}
