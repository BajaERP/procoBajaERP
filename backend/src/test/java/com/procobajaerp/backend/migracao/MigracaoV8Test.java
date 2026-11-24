package com.procobajaerp.backend.migracao;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.junit.jupiter.api.Test;

import com.procobajaerp.backend.BancoDeTeste;

/** A V8 cria o Subsistema Financeiro e migra a responsabilidade atual para a regra de vínculo. */
class MigracaoV8Test {

    @Test
    void criaFinanceiroInativoEConservaOGestorFinanceiroAtual() {
        DataSource banco = BancoDeTeste.bancoVazio("migracao_v8_gestor_atual");
        migrarAte(banco, "7");
        JdbcTemplate jdbc = new JdbcTemplate(banco);
        long capitao = inserirUsuario(jdbc, "2400001", "CAPITAO_ADMIN", null);
        long gestor = inserirUsuario(jdbc, "2400002", "GESTOR", null);
        jdbc.update("INSERT INTO atribuicao_financeira (gestor_usuario_id, atribuida_por_usuario_id) VALUES (?, ?)",
                gestor, capitao);

        migrarAte(banco, "8");

        long financeiro = jdbc.queryForObject("SELECT id FROM subsistemas WHERE nome = 'Financeiro'", Long.class);
        assertThat(jdbc.queryForObject("SELECT ativo FROM subsistemas WHERE id = ?", Boolean.class, financeiro)).isFalse();
        assertThat(jdbc.queryForObject("SELECT subsistema_id FROM usuarios WHERE id = ?", Long.class, gestor))
                .isEqualTo(financeiro);
        assertThat(jdbc.queryForObject("SELECT to_regclass('atribuicao_financeira') IS NULL", Boolean.class)).isTrue();
        assertThat(jdbc.queryForObject("SELECT perfil_id FROM usuarios WHERE id = ?", Long.class, gestor))
                .isEqualTo(jdbc.queryForObject("SELECT id FROM perfis WHERE nome = 'GESTOR'", Long.class));

        long outroGestor = inserirUsuario(jdbc, "2400003", "GESTOR", financeiro, false);
        assertThatThrownBy(() -> jdbc.update("UPDATE usuarios SET ativo = true WHERE id = ?", outroGestor))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void criaFinanceiroSemAtribuirResponsabilidadeQuandoNaoHaGestorAtual() {
        DataSource banco = BancoDeTeste.bancoVazio("migracao_v8_sem_gestor_atual");
        migrarAte(banco, "7");
        JdbcTemplate jdbc = new JdbcTemplate(banco);

        migrarAte(banco, "8");

        assertThat(jdbc.queryForObject("SELECT count(*) FROM subsistemas WHERE nome = 'Financeiro'", Integer.class))
                .isOne();
        assertThat(jdbc.queryForObject("SELECT to_regclass('atribuicao_financeira') IS NULL", Boolean.class)).isTrue();
    }

    private static void migrarAte(DataSource banco, String versao) {
        Flyway.configure().dataSource(banco).target(versao).load().migrate();
    }

    private static long inserirUsuario(JdbcTemplate jdbc, String ra, String perfil, Long subsistemaId) {
        return inserirUsuario(jdbc, ra, perfil, subsistemaId, true);
    }

    private static long inserirUsuario(JdbcTemplate jdbc, String ra, String perfil, Long subsistemaId, boolean ativo) {
        return jdbc.queryForObject("""
                INSERT INTO usuarios (ra, nome, senha_hash, perfil_id, subsistema_id, ativo)
                VALUES (?, ?, 'hash', (SELECT id FROM perfis WHERE nome = ?), ?, ?)
                RETURNING id""", Long.class, ra, ra, perfil, subsistemaId, ativo);
    }
}
