package com.procobajaerp.backend.seguranca;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import org.springframework.security.web.csrf.CsrfException;

/**
 * Explica a recusa de quem ainda está com a Senha provisória, para o frontend levar à troca de senha. As demais
 * recusas, como a de token CSRF inválido, seguem o tratamento padrão.
 */
class TrocaDeSenhaPendenteHandler implements AccessDeniedHandler {

    static final String MENSAGEM = "Troque a senha provisória antes de acessar o ERP.";

    private final AccessDeniedHandler padrao = new AccessDeniedHandlerImpl();

    @Override
    public void handle(HttpServletRequest requisicao, HttpServletResponse resposta, AccessDeniedException erro)
            throws IOException, ServletException {
        if (!(erro instanceof CsrfException)
                && UsuarioAutenticado.comTrocaDeSenhaPendente(SecurityContextHolder.getContext().getAuthentication())) {
            resposta.setStatus(HttpStatus.FORBIDDEN.value());
            resposta.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
            resposta.setCharacterEncoding("UTF-8");
            resposta.getWriter().write("{\"type\":\"about:blank\",\"title\":\"Forbidden\",\"status\":403,\"detail\":\""
                    + MENSAGEM + "\",\"trocaDeSenhaPendente\":true}");
            return;
        }
        padrao.handle(requisicao, resposta, erro);
    }
}
