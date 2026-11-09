package com.procobajaerp.backend.seguranca;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.web.csrf.CsrfTokenRepository;

class SegurancaConfigTest {

    /** Em produção o cookie XSRF-TOKEN segue o de sessão e só trafega por HTTPS, mesmo atrás de um proxy. */
    @ParameterizedTest
    @ValueSource(booleans = {true, false})
    void cookieXsrfSegueAConfiguracaoDoCookieDeSessao(boolean cookieSeguro) {
        CsrfTokenRepository repositorio = new SegurancaConfig().repositorioDeCsrf(cookieSeguro);
        MockHttpServletRequest requisicao = new MockHttpServletRequest();
        MockHttpServletResponse resposta = new MockHttpServletResponse();

        repositorio.saveToken(repositorio.generateToken(requisicao), requisicao, resposta);

        String cookie = resposta.getHeader("Set-Cookie");
        assertThat(cookie).startsWith("XSRF-TOKEN=").doesNotContainIgnoringCase("HttpOnly");
        assertThat(cookie.toLowerCase().contains("secure")).isEqualTo(cookieSeguro);
    }
}
