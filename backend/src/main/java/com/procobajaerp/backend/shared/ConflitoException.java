package com.procobajaerp.backend.shared;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponseException;

/** Valor que precisa ser único já está em uso, como um RA ou um nome de Subsistema. Responde 409. */
public class ConflitoException extends ErrorResponseException {

    public ConflitoException(String mensagem) {
        this(mensagem, Map.of());
    }

    public ConflitoException(String mensagem, Map<String, ?> propriedades) {
        super(HttpStatus.CONFLICT, RegraDeNegocioException.problema(HttpStatus.CONFLICT, mensagem, propriedades), null);
    }

    @Override
    public String getMessage() {
        return getBody().getDetail();
    }
}
