package com.procobajaerp.backend.shared;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponseException;

/** O Perfil de quem pede não permite a operação naquele registro. Responde 403. */
public class AcessoNegadoException extends ErrorResponseException {

    public AcessoNegadoException(String mensagem) {
        super(HttpStatus.FORBIDDEN, RegraDeNegocioException.problema(HttpStatus.FORBIDDEN, mensagem, Map.of()), null);
    }

    @Override
    public String getMessage() {
        return getBody().getDetail();
    }
}
