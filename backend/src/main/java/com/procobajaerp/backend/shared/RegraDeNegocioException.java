package com.procobajaerp.backend.shared;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

/** Operação recusada por uma regra de negócio. Responde 422 com a explicação em {@code detail}. */
public class RegraDeNegocioException extends ErrorResponseException {

    public RegraDeNegocioException(String mensagem) {
        this(mensagem, Map.of());
    }

    /** As propriedades extras vão no corpo da resposta, para o frontend oferecer o próximo passo. */
    public RegraDeNegocioException(String mensagem, Map<String, ?> propriedades) {
        super(HttpStatus.UNPROCESSABLE_CONTENT, problema(HttpStatus.UNPROCESSABLE_CONTENT, mensagem, propriedades), null);
    }

    static ProblemDetail problema(HttpStatus status, String mensagem, Map<String, ?> propriedades) {
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(status, mensagem);
        propriedades.forEach(problema::setProperty);
        return problema;
    }

    @Override
    public String getMessage() {
        return getBody().getDetail();
    }
}
