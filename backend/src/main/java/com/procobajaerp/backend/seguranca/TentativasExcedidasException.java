package com.procobajaerp.backend.seguranca;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

public class TentativasExcedidasException extends ErrorResponseException {

    TentativasExcedidasException() {
        super(HttpStatus.TOO_MANY_REQUESTS, ProblemDetail.forStatusAndDetail(HttpStatus.TOO_MANY_REQUESTS,
                "Muitas tentativas de login com este RA. Aguarde alguns minutos e tente de novo."), null);
    }
}
