package com.procobajaerp.backend.shared;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponseException;

/** Registro inexistente ou que o Perfil de quem consulta não pode ver. Responde 404. */
public class NaoEncontradoException extends ErrorResponseException {

    public NaoEncontradoException(String mensagem) {
        super(HttpStatus.NOT_FOUND, RegraDeNegocioException.problema(HttpStatus.NOT_FOUND, mensagem, Map.of()), null);
    }

    @Override
    public String getMessage() {
        return getBody().getDetail();
    }
}
