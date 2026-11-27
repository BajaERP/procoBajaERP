package com.procobajaerp.backend.atividades.domain;

import java.util.List;
import java.util.Map;

import com.procobajaerp.backend.shared.RegraDeNegocioException;

/** Escala Fibonacci permitida para a Estimativa de esforço no ERP. */
public final class EstimativaFibonacci {

    public static final List<Integer> PERMITIDAS = List.of(1, 2, 3, 5, 8, 13, 21);

    private EstimativaFibonacci() {
    }

    public static boolean ehValida(Integer valor) {
        return valor != null && PERMITIDAS.contains(valor);
    }

    public static void validar(Integer valor) {
        if (valor != null && !PERMITIDAS.contains(valor)) {
            throw new RegraDeNegocioException(
                    "A estimativa de esforço deve ser um valor Fibonacci válido (1, 2, 3, 5, 8, 13 ou 21).",
                    Map.of("erros", Map.of("estimativaFibonacci", "Escolha 1, 2, 3, 5, 8, 13 ou 21.")));
        }
    }
}
