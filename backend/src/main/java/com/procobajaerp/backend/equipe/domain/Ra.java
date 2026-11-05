package com.procobajaerp.backend.equipe.domain;

import java.util.Locale;
import java.util.regex.Pattern;

import com.procobajaerp.backend.shared.RegraDeNegocioException;

/** Identificador de login: o RA do aluno ou, para o Orientador, o SIAPE. */
public final class Ra {

    private static final Pattern FORMATO = Pattern.compile("[a-z0-9]{1,20}");

    private Ra() {
    }

    /** Forma em que o RA é guardado e procurado: sem espaços nas pontas e em minúsculas. */
    public static String normalizar(String ra) {
        return ra == null ? "" : ra.strip().toLowerCase(Locale.ROOT);
    }

    /** Normaliza e confere o formato: só letras e dígitos, com até 20 caracteres. */
    public static String validar(String ra) {
        String normalizado = normalizar(ra);
        if (!FORMATO.matcher(normalizado).matches()) {
            throw new RegraDeNegocioException("O RA deve ter de 1 a 20 letras ou dígitos, sem espaços nem símbolos.");
        }
        return normalizado;
    }
}
