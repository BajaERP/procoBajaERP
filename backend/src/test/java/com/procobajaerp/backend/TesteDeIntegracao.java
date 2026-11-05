package com.procobajaerp.backend;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import com.procobajaerp.backend.equipe.domain.Perfil;

/**
 * Testes de ponta a ponta pela API, num PostgreSQL real com as migrations aplicadas. As tabelas do módulo de
 * Equipe são esvaziadas antes de cada teste; os dados de partida entram direto no banco.
 */
@SpringBootTest
@AutoConfigureMockMvc
public abstract class TesteDeIntegracao {

    protected static final String SENHA = "senha-de-teste";

    private static String hashDaSenha;

    @DynamicPropertySource
    static void banco(DynamicPropertyRegistry propriedades) {
        BancoDeTeste.registrar(propriedades);
    }

    @Autowired
    protected MockMvc mvc;

    @Autowired
    protected JdbcTemplate jdbc;

    @Autowired
    private PasswordEncoder codificador;

    @BeforeEach
    void esvaziarTabelasDaEquipe() {
        jdbc.execute("TRUNCATE logs_auditoria, vinculos_financeiro_gestor, subsistemas, usuarios RESTART IDENTITY CASCADE");
    }

    /** Usuário ativo, com nome igual ao RA e a senha {@link #SENHA}. */
    protected long usuario(String ra, Perfil perfil, Long subsistemaId) {
        return usuario(ra, perfil, subsistemaId, true);
    }

    protected long usuario(String ra, Perfil perfil, Long subsistemaId, boolean ativo) {
        if (hashDaSenha == null) {
            hashDaSenha = codificador.encode(SENHA);
        }
        return jdbc.queryForObject("""
                INSERT INTO usuarios (ra, nome, senha_hash, perfil_id, subsistema_id, ativo)
                VALUES (?, ?, ?, (SELECT id FROM perfis WHERE nome = ?), ?, ?)
                RETURNING id""", Long.class, ra, ra, hashDaSenha, perfil.name(), subsistemaId, ativo);
    }

    /** Subsistema desativado e sem Líder, como nasce. */
    protected long subsistema(String nome) {
        return jdbc.queryForObject("INSERT INTO subsistemas (nome) VALUES (?) RETURNING id", Long.class, nome);
    }

    /** Subsistema ativo, com um Líder cujo RA é informado. */
    protected long subsistemaComLider(String nome, String raDoLider) {
        long subsistema = subsistema(nome);
        long lider = usuario(raDoLider, Perfil.LIDER, subsistema);
        jdbc.update("UPDATE subsistemas SET lider_usuario_id = ?, ativo = true WHERE id = ?", lider, subsistema);
        return subsistema;
    }

    protected void vinculo(long financeiro, long gestor, long capitao) {
        jdbc.update("INSERT INTO vinculos_financeiro_gestor (financeiro_usuario_id, gestor_usuario_id, definido_por_usuario_id) "
                + "VALUES (?, ?, ?)", financeiro, gestor, capitao);
    }

    protected MockHttpSession login(String ra) throws Exception {
        return (MockHttpSession) mvc.perform(json(post("/api/auth/login"), Map.of("ra", ra, "senha", SENHA)))
                .andExpect(status().isOk())
                .andReturn().getRequest().getSession();
    }

    /** Corpo JSON com token CSRF, como o frontend envia. */
    protected static MockHttpServletRequestBuilder json(MockHttpServletRequestBuilder requisicao, String corpo) {
        return requisicao.with(csrf()).contentType(MediaType.APPLICATION_JSON).content(corpo);
    }

    protected static MockHttpServletRequestBuilder json(MockHttpServletRequestBuilder requisicao, Map<String, ?> corpo) {
        StringBuilder texto = new StringBuilder("{");
        corpo.forEach((chave, valor) -> {
            if (texto.length() > 1) {
                texto.append(',');
            }
            texto.append('"').append(chave).append("\":");
            texto.append(valor instanceof String ? "\"" + valor + "\"" : String.valueOf(valor));
        });
        return json(requisicao, texto.append('}').toString());
    }

    protected String perfilNoBanco(long usuario) {
        return jdbc.queryForObject("SELECT p.nome FROM usuarios u JOIN perfis p ON p.id = u.perfil_id WHERE u.id = ?",
                String.class, usuario);
    }

    protected Long subsistemaNoBanco(long usuario) {
        return jdbc.queryForObject("SELECT subsistema_id FROM usuarios WHERE id = ?", Long.class, usuario);
    }

    protected boolean ativoNoBanco(long usuario) {
        return jdbc.queryForObject("SELECT ativo FROM usuarios WHERE id = ?", Boolean.class, usuario);
    }

    protected List<String> acoesAuditadas(String entidade, long registro) {
        return jdbc.queryForList("SELECT acao FROM logs_auditoria WHERE entidade = ? AND registro_id = ? ORDER BY id",
                String.class, entidade, registro);
    }
}
