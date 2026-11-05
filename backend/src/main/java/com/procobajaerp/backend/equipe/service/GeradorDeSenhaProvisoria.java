package com.procobajaerp.backend.equipe.service;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

/** Gera a Senha provisória do cadastro e da redefinição, sem caracteres fáceis de confundir (0/O, 1/l/I). */
@Component
public class GeradorDeSenhaProvisoria {

    private static final String ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    private static final int TAMANHO = 12;

    private final SecureRandom aleatorio = new SecureRandom();

    public String gerar() {
        StringBuilder senha = new StringBuilder(TAMANHO);
        for (int i = 0; i < TAMANHO; i++) {
            senha.append(ALFABETO.charAt(aleatorio.nextInt(ALFABETO.length())));
        }
        return senha.toString();
    }
}
