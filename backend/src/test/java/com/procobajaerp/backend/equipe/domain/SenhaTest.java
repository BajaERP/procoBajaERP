package com.procobajaerp.backend.equipe.domain;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import com.procobajaerp.backend.shared.RegraDeNegocioException;

class SenhaTest {

    @ParameterizedTest
    @ValueSource(ints = {8, 64})
    void aceitaDe8A64Caracteres(int tamanho) {
        assertThatCode(() -> Senha.validar("a".repeat(tamanho))).doesNotThrowAnyException();
    }

    @ParameterizedTest
    @ValueSource(ints = {0, 7, 65})
    void recusaForaDe8A64Caracteres(int tamanho) {
        assertThatThrownBy(() -> Senha.validar("a".repeat(tamanho)))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessage(Senha.TAMANHO);
    }

    @Test
    void acentosContamPeloEspacoQueOcupamNoHash() {
        assertThatCode(() -> Senha.validar("ç".repeat(36))).doesNotThrowAnyException();
        assertThatThrownBy(() -> Senha.validar("ç".repeat(37)))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessage(Senha.LONGA_DEMAIS);
    }
}
