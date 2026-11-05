package com.procobajaerp.backend.seguranca;

import java.io.IOException;
import java.util.Optional;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.procobajaerp.backend.equipe.service.ContaService;
import com.procobajaerp.backend.equipe.service.ContaService.DadosDeAcesso;

/**
 * Recarrega do banco, a cada requisição, quem está logado. Assim uma Troca de Perfil vale na requisição
 * seguinte, e um Usuário desativado perde a sessão (ADR 0001).
 */
class AtualizacaoDaSessaoFilter extends OncePerRequestFilter {

    private final ContaService contas;

    AtualizacaoDaSessaoFilter(ContaService contas) {
        this.contas = contas;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest requisicao, HttpServletResponse resposta, FilterChain cadeia)
            throws ServletException, IOException {
        Authentication atual = SecurityContextHolder.getContext().getAuthentication();
        if (atual != null && atual.getPrincipal() instanceof UsuarioAutenticado logado) {
            Optional<UsuarioAutenticado> recarregado = contas.buscarPorId(logado.getId())
                    .filter(DadosDeAcesso::ativo)
                    .map(UsuarioAutenticado::new);
            if (recarregado.isPresent()) {
                UsuarioAutenticado usuario = recarregado.get();
                usuario.eraseCredentials();
                SecurityContext contexto = SecurityContextHolder.createEmptyContext();
                contexto.setAuthentication(
                        UsernamePasswordAuthenticationToken.authenticated(usuario, null, usuario.getAuthorities()));
                SecurityContextHolder.setContext(contexto);
            } else {
                SecurityContextHolder.clearContext();
                HttpSession sessao = requisicao.getSession(false);
                if (sessao != null) {
                    sessao.invalidate();
                }
            }
        }
        cadeia.doFilter(requisicao, resposta);
    }
}
