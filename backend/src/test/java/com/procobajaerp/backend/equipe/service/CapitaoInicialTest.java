package com.procobajaerp.backend.equipe.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.auditoria.service.AuditoriaService;
import com.procobajaerp.backend.equipe.domain.Perfil;
import com.procobajaerp.backend.equipe.repository.PerfilRepository;
import com.procobajaerp.backend.equipe.repository.UsuarioRepository;

class CapitaoInicialTest extends TesteDeIntegracao {

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private PerfilRepository perfis;

    @Autowired
    private PasswordEncoder codificador;

    @Autowired
    private AuditoriaService auditoria;

    @Test
    void criaOCapitaoQuandoNaoHaNenhumAtivo() throws Exception {
        capitaoInicial(" 1234567 ", "Primeiro Capitão", "senha-inicial").criarSeNecessario();

        long capitao = jdbc.queryForObject("SELECT id FROM usuarios WHERE ra = '1234567'", Long.class);
        assertThat(perfilNoBanco(capitao)).isEqualTo("CAPITAO_ADMIN");
        assertThat(subsistemaNoBanco(capitao)).isNull();
        assertThat(ativoNoBanco(capitao)).isTrue();
        assertThat(acoesAuditadas("USUARIO", capitao)).containsExactly("CADASTRADO");
        mvc.perform(json(post("/api/auth/login"),
                        Map.of("ra", "1234567", "senha", "senha-inicial")))
                .andExpect(status().isOk());
    }

    @Test
    void naoCriaSeJaExisteCapitaoAtivo() {
        usuario("capitao", Perfil.CAPITAO_ADMIN, null);
        capitaoInicial("7654321", "Outro", "senha-inicial").criarSeNecessario();

        assertThat(usuarios.existsByRa("7654321")).isFalse();
    }

    @Test
    void naoCriaSemConfiguracaoNemComSenhaForaDoTamanho() {
        capitaoInicial(null, null, null).criarSeNecessario();
        capitaoInicial("1234567", "Capitão", "curta").criarSeNecessario();
        capitaoInicial("1234567", "Capitão", "a".repeat(65)).criarSeNecessario();
        capitaoInicial("1234567", "Capitão", "ç".repeat(40)).criarSeNecessario();

        assertThat(usuarios.count()).isZero();
    }

    private CapitaoInicial capitaoInicial(String ra, String nome, String senha) {
        return new CapitaoInicial(new CapitaoInicial.Propriedades(ra, nome, senha), usuarios, perfis, codificador, auditoria);
    }
}
