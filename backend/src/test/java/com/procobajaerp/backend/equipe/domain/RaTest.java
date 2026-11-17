package com.procobajaerp.backend.equipe.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.api.Test;

import com.procobajaerp.backend.shared.RegraDeNegocioException;

class RaTest {

    @Test
    void guardaSemEspacosNasPontas() {
        assertThat(Ra.validar("  2412345 ")).isEqualTo("2412345");
    }

    @Test
    void aceitaRaESiapeSoComDigitos() {
        assertThat(Ra.validar("1234567")).isEqualTo("1234567");
        assertThat(Ra.validar("1".repeat(20))).isEqualTo("1".repeat(20));
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   ", "a2412345", "A2412345", "2412345a", "2 412345", "24-12345", "24.123", "+2412345",
            "çãé", "１２３", "123456789012345678901"})
    void recusaLetrasSimbolosEFormatoInvalido(String ra) {
        assertThatThrownBy(() -> Ra.validar(ra)).isInstanceOf(RegraDeNegocioException.class).hasMessage(Ra.MENSAGEM_FORMATO_INVALIDO);
    }
}
