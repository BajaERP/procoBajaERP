package com.procobajaerp.backend.seguranca;

import java.io.IOException;
import java.util.Map;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import org.springframework.security.web.csrf.CsrfException;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.procobajaerp.backend.shared.RegraDeNegocioException;

/**
 * Explica a recusa de quem ainda está com a Senha provisória, para o frontend levar à troca de senha. A resposta sai
 * pelo {@code TratadorDeErros}, como os demais erros da API. As outras recusas, como a de token CSRF inválido, seguem
 * o tratamento padrão.
 */
class TrocaDeSenhaPendenteHandler implements AccessDeniedHandler {

    static final String MENSAGEM = "Troque a senha provisória antes de acessar o ERP.";

    private final AccessDeniedHandler padrao = new AccessDeniedHandlerImpl();
    private final HandlerExceptionResolver tratadorDeErros;

    TrocaDeSenhaPendenteHandler(HandlerExceptionResolver tratadorDeErros) {
        this.tratadorDeErros = tratadorDeErros;
    }

    @Override
    public void handle(HttpServletRequest requisicao, HttpServletResponse resposta, AccessDeniedException erro)
            throws IOException, ServletException {
        if (!(erro instanceof CsrfException)
                && UsuarioAutenticado.comTrocaDeSenhaPendente(SecurityContextHolder.getContext().getAuthentication())) {
            tratadorDeErros.resolveException(requisicao, resposta, null, new TrocaDeSenhaPendenteException());
            return;
        }
        padrao.handle(requisicao, resposta, erro);
    }

    /** 403 com {@code trocaDeSenhaPendente: true} no ProblemDetail. */
    static final class TrocaDeSenhaPendenteException extends ErrorResponseException {

        TrocaDeSenhaPendenteException() {
            super(HttpStatus.FORBIDDEN, RegraDeNegocioException.problema(HttpStatus.FORBIDDEN, MENSAGEM,
                    Map.of("trocaDeSenhaPendente", true)), null);
        }
    }
}
