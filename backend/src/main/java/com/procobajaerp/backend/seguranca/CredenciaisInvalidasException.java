package com.procobajaerp.backend.seguranca;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** Mesma resposta para RA inexistente, senha errada e Usuário desativado, para não revelar qual foi o caso. */
public class CredenciaisInvalidasException extends ErrorResponseException {

    public CredenciaisInvalidasException() {
        super(HttpStatus.UNAUTHORIZED,
                ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "RA ou senha inválidos."), null);
    }
}
