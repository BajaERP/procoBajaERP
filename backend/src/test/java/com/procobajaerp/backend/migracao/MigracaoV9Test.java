package com.procobajaerp.backend.migracao;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;

import com.procobajaerp.backend.BancoDeTeste;

/** A V9 garante no banco que exista no máximo um Capitão ativo. */
class MigracaoV9Test {

    @Test
    void criaIndiceUnicoParaCapitaoAtivo() {
        DataSource banco = BancoDeTeste.bancoVazio("migracao_v9_capitao_unico");
        migrarAte(banco, "8");
        JdbcTemplate jdbc = new JdbcTemplate(banco);
        inserirUsuario(jdbc, "2400001", true);

        migrarAte(banco, "9");

        assertThat(jdbc.queryForObject("SELECT to_regclass('ux_usuario_unico_capitao_ativo') IS NOT NULL", Boolean.class))
                .isTrue();
        assertThatThrownBy(() -> inserirUsuario(jdbc, "2400002", true))
                .isInstanceOf(DataIntegrityViolationException.class);
        inserirUsuario(jdbc, "2400003", false);
    }

    @Test
    void interrompeSeBancoJaTiverMaisDeUmCapitaoAtivo() {
        DataSource banco = BancoDeTeste.bancoVazio("migracao_v9_capitoes_duplicados");
        migrarAte(banco, "8");
        JdbcTemplate jdbc = new JdbcTemplate(banco);
        inserirUsuario(jdbc, "2400001", true);
        inserirUsuario(jdbc, "2400002", true);

        assertThatThrownBy(() -> migrarAte(banco, "9"))
                .hasMessageContaining("há mais de um Capitão ativo");
    }

    private static void migrarAte(DataSource banco, String versao) {
        Flyway.configure().dataSource(banco).target(versao).load().migrate();
    }

    private static long inserirUsuario(JdbcTemplate jdbc, String ra, boolean ativo) {
        return jdbc.queryForObject("""
                INSERT INTO usuarios (ra, nome, senha_hash, perfil_id, ativo)
                VALUES (?, ?, 'hash', (SELECT id FROM perfis WHERE nome = 'CAPITAO_ADMIN'), ?)
                RETURNING id""", Long.class, ra, ra, ativo);
    }
}
