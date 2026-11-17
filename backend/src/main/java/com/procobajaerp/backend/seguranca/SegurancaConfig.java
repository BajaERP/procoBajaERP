package com.procobajaerp.backend.seguranca;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.security.web.context.SecurityContextHolderFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRepository;

import com.procobajaerp.backend.equipe.service.ContaService;

/**
 * Sessão guardada no servidor, com cookie HttpOnly e proteção CSRF para a SPA (ADR 0001). A autorização usa
 * os códigos de permissão do Perfil; as regras de hierarquia e de visibilidade ficam nos services.
 */
@Configuration
@EnableMethodSecurity
public class SegurancaConfig {

    @Bean
    SecurityFilterChain filtrosDeSeguranca(HttpSecurity http, ContaService contas, CsrfTokenRepository repositorioDeCsrf)
            throws Exception {
        http
                .csrf(csrf -> csrf.spa().csrfTokenRepository(repositorioDeCsrf))
                .authorizeHttpRequests(rotas -> rotas
                        .requestMatchers(HttpMethod.GET, "/api/auth/csrf").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/error").permitAll()
                        // Com a Senha provisória, só o Usuário atual e a troca da própria senha; o logout é tratado antes.
                        .requestMatchers(HttpMethod.GET, "/api/auth/eu").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/auth/senha").authenticated()
                        .anyRequest().access((autenticacao, contexto) -> new AuthorizationDecision(senhaDefinitiva(autenticacao.get()))))
                .exceptionHandling(erros -> erros
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                        .accessDeniedHandler(new TrocaDeSenhaPendenteHandler()))
                .logout(saida -> saida
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler(HttpStatus.NO_CONTENT)))
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .requestCache(AbstractHttpConfigurer::disable)
                .addFilterAfter(new AtualizacaoDaSessaoFilter(contas), SecurityContextHolderFilter.class);
        return http.build();
    }

    /** Com a Senha provisória, os módulos ficam fechados até o próprio Usuário trocá-la em /api/auth/senha. */
    private static boolean senhaDefinitiva(Authentication autenticacao) {
        return autenticacao != null && autenticacao.getPrincipal() instanceof UsuarioAutenticado
                && !UsuarioAutenticado.comTrocaDeSenhaPendente(autenticacao);
    }

    /**
     * Cookie XSRF-TOKEN legível pelo frontend, que o reenvia no cabeçalho X-XSRF-TOKEN. É o mesmo repositório que
     * o {@code csrf().spa()} usaria; vira bean para o login trocar o token, como o formLogin faria. Quando o
     * cookie de sessão é Secure, este também é: atrás de um proxy com HTTPS o backend recebe HTTP e não saberia.
     */
    @Bean
    CsrfTokenRepository repositorioDeCsrf(@Value("${server.servlet.session.cookie.secure:false}") boolean cookieSeguro) {
        CookieCsrfTokenRepository repositorio = CookieCsrfTokenRepository.withHttpOnlyFalse();
        if (cookieSeguro) {
            repositorio.setCookieCustomizer(cookie -> cookie.secure(true));
        }
        return repositorio;
    }

    /** BCrypt, com o prefixo do algoritmo no hash para permitir trocá-lo no futuro (RNF05). */
    @Bean
    PasswordEncoder codificadorDeSenhas() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    AuthenticationManager autenticador(ContaService contas, PasswordEncoder codificador) {
        DaoAuthenticationProvider provedor = new DaoAuthenticationProvider(new CarregadorDeUsuarios(contas));
        provedor.setPasswordEncoder(codificador);
        return new ProviderManager(provedor);
    }
}
