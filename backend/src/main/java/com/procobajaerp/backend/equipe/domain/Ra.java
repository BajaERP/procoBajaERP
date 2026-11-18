package com.procobajaerp.backend.equipe.domain;

import java.util.regex.Pattern;

import com.procobajaerp.backend.shared.RegraDeNegocioException;

/** Identificador de login: o RA do aluno ou, para o Orientador, o SIAPE. */
public final class Ra {

    /** De 1 a 20 dígitos, sem letras, espaços nem símbolos. */
    public static final String DIGITOS = "[0-9]{1,20}";

    public static final String MENSAGEM_FORMATO_INVALIDO = "O RA ou SIAPE deve ter de 1 a 20 dígitos, sem letras, espaços nem símbolos.";

    private static final Pattern FORMATO = Pattern.compile(DIGITOS);

    private Ra() {
    }

    /** Forma em que o RA é guardado e procurado: sem espaços nas pontas. */
    public static String normalizar(String ra) {
        return ra == null ? "" : ra.strip();
    }

    /** Normaliza e confere o formato: só dígitos, com até 20. */
    public static String validar(String ra) {
        String normalizado = normalizar(ra);
        if (!FORMATO.matcher(normalizado).matches()) {
            throw new RegraDeNegocioException(MENSAGEM_FORMATO_INVALIDO);
        }
        return normalizado;
    }
}
