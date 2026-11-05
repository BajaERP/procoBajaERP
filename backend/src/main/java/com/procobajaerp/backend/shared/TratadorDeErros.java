package com.procobajaerp.backend.shared;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Responde todos os erros da API no formato ProblemDetail (RFC 9457), com a mensagem para o usuário em
 * {@code detail}. As exceções do projeto estendem {@code ErrorResponseException} e já trazem o status.
 */
@RestControllerAdvice
public class TratadorDeErros extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        Map<String, String> erros = new LinkedHashMap<>();
        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            erros.putIfAbsent(erro.getField(), erro.getDefaultMessage());
        }
        ProblemDetail problema = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Confira os campos destacados.");
        problema.setProperty("erros", erros);
        return handleExceptionInternal(ex, problema, headers, HttpStatus.BAD_REQUEST, request);
    }

    /** Recusas do {@code @PreAuthorize}: o Perfil não tem a permissão do catálogo. */
    @ExceptionHandler(AccessDeniedException.class)
    ProblemDetail acessoNegado() {
        return ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "Seu Perfil não permite esta operação.");
    }
}
