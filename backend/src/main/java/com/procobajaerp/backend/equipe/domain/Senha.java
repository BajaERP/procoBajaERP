package com.procobajaerp.backend.equipe.domain;

import java.nio.charset.StandardCharsets;

import com.procobajaerp.backend.shared.RegraDeNegocioException;

/** Regra das senhas escolhidas por pessoas: de 8 a 64 caracteres, e que caibam no hash BCrypt. */
public final class Senha {

    public static final int MINIMO = 8;
    public static final int MAXIMO = 64;
    public static final String TAMANHO = "A senha deve ter de 8 a 64 caracteres.";
    public static final String LONGA_DEMAIS = "A senha é longa demais: letras acentuadas ocupam mais espaço. Use menos caracteres.";

    /** O BCrypt recusa senhas acima de 72 bytes, e uma letra acentuada ocupa 2 bytes em UTF-8. */
    private static final int MAXIMO_DE_BYTES = 72;

    private Senha() {
    }

    public static void validar(String senha) {
        if (senha == null || senha.length() < MINIMO || senha.length() > MAXIMO) {
            throw new RegraDeNegocioException(TAMANHO);
        }
        if (senha.getBytes(StandardCharsets.UTF_8).length > MAXIMO_DE_BYTES) {
            throw new RegraDeNegocioException(LONGA_DEMAIS);
        }
    }
}
