package com.procobajaerp.backend.seguranca;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import com.procobajaerp.backend.TesteDeIntegracao;
import com.procobajaerp.backend.equipe.domain.Perfil;

/**
 * O caminho do navegador por HTTP de verdade: cookies de sessão e XSRF-TOKEN e o cabeçalho X-XSRF-TOKEN. O
 * {@code csrf()} do MockMvc troca o repositório de tokens, então só aqui o CSRF real é exercitado. Por isso
 * esta classe não usa {@code login()} do MockMvc.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class FluxoDoNavegadorTest extends TesteDeIntegracao {

    @LocalServerPort
    private int porta;

    private final HttpClient cliente = HttpClient.newHttpClient();
    private final Map<String, String> cookies = new HashMap<>();

    @Test
    void loginEAlteracaoComOCookieXsrfReenviadoNoCabecalho() throws Exception {
        usuario("orientador", Perfil.ORIENTADOR, null);

        HttpResponse<String> csrf = enviar("GET", "/api/auth/csrf", null, null);
        assertThat(csrf.statusCode()).isEqualTo(204);
        assertThat(setCookie(csrf, "XSRF-TOKEN")).doesNotContainIgnoringCase("HttpOnly");
        String tokenAnonimo = cookies.get("XSRF-TOKEN");
        assertThat(tokenAnonimo).isNotBlank();

        String credenciais = "{\"ra\":\"orientador\",\"senha\":\"" + SENHA + "\"}";
        assertThat(enviar("POST", "/api/auth/login", credenciais, null).statusCode()).isEqualTo(403);

        HttpResponse<String> login = enviar("POST", "/api/auth/login", credenciais, tokenAnonimo);
        assertThat(login.statusCode()).isEqualTo(200);
        assertThat(setCookie(login, "JSESSIONID")).containsIgnoringCase("HttpOnly").containsIgnoringCase("SameSite=Lax");
        String tokenDaSessao = cookies.get("XSRF-TOKEN");
        assertThat(tokenDaSessao).isNotBlank().isNotEqualTo(tokenAnonimo);

        assertThat(enviar("GET", "/api/auth/eu", null, null).statusCode()).isEqualTo(200);
        assertThat(enviar("POST", "/api/auth/logout", null, tokenAnonimo).statusCode()).isEqualTo(403);
        assertThat(enviar("POST", "/api/auth/logout", null, tokenDaSessao).statusCode()).isEqualTo(204);
        assertThat(cookies.get("XSRF-TOKEN")).as("o logout troca o token").isNotEqualTo(tokenDaSessao);
        assertThat(enviar("GET", "/api/auth/eu", null, null).statusCode()).isEqualTo(401);
    }

    private HttpResponse<String> enviar(String metodo, String caminho, String corpo, String tokenXsrf) throws Exception {
        HttpRequest.Builder requisicao = HttpRequest.newBuilder(URI.create("http://localhost:" + porta + caminho))
                .method(metodo, corpo == null ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofString(corpo));
        if (corpo != null) {
            requisicao.header("Content-Type", "application/json");
        }
        if (tokenXsrf != null) {
            requisicao.header("X-XSRF-TOKEN", tokenXsrf);
        }
        if (!cookies.isEmpty()) {
            requisicao.header("Cookie", String.join("; ",
                    cookies.entrySet().stream().map(c -> c.getKey() + "=" + c.getValue()).toList()));
        }
        HttpResponse<String> resposta = cliente.send(requisicao.build(), HttpResponse.BodyHandlers.ofString());
        guardarCookies(resposta);
        return resposta;
    }

    /** Como o navegador: o último Set-Cookie de cada nome vale, e valor vazio apaga. */
    private void guardarCookies(HttpResponse<?> resposta) {
        for (String cabecalho : resposta.headers().allValues("Set-Cookie")) {
            String par = cabecalho.split(";", 2)[0];
            String nome = par.substring(0, par.indexOf('='));
            String valor = par.substring(par.indexOf('=') + 1);
            if (valor.isEmpty() || cabecalho.toLowerCase().contains("max-age=0")) {
                cookies.remove(nome);
            } else {
                cookies.put(nome, valor);
            }
        }
    }

    private static String setCookie(HttpResponse<?> resposta, String nome) {
        List<String> cabecalhos = resposta.headers().allValues("Set-Cookie").stream()
                .filter(c -> c.startsWith(nome + "=") && !c.startsWith(nome + "=;"))
                .toList();
        assertThat(cabecalhos).as("Set-Cookie de %s", nome).isNotEmpty();
        return cabecalhos.getLast();
    }
}
