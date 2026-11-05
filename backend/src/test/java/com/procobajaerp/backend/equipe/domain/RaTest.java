package com.procobajaerp.backend.equipe.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.api.Test;

import com.procobajaerp.backend.shared.RegraDeNegocioException;

class RaTest {

    @Test
    void guardaSemEspacosNasPontasEEmMinusculas() {
        assertThat(Ra.validar("  A2412345 ")).isEqualTo("a2412345");
    }

    @Test
    void aceitaSiapeSoComDigitos() {
        assertThat(Ra.validar("1234567")).isEqualTo("1234567");
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   ", "a 2412345", "a-2412345", "ra.123", "çãé", "a23456789012345678901"})
    void recusaFormatoInvalido(String ra) {
        assertThatThrownBy(() -> Ra.validar(ra)).isInstanceOf(RegraDeNegocioException.class);
    }
}
