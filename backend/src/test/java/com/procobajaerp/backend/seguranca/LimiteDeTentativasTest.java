package com.procobajaerp.backend.seguranca;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;

class LimiteDeTentativasTest {

    private final RelogioAjustavel relogio = new RelogioAjustavel();
    private final LimiteDeTentativas limite = new LimiteDeTentativas(relogio);

    @Test
    void bloqueiaDepoisDeCincoErrosEmQuinzeMinutos() {
        errar("a1", 5);
        assertThatThrownBy(() -> limite.exigirTentativaLiberada("a1")).isInstanceOf(TentativasExcedidasException.class);
    }

    @Test
    void quatroErrosAindaDeixamTentar() {
        errar("a1", 4);
        assertThatCode(() -> limite.exigirTentativaLiberada("a1")).doesNotThrowAnyException();
    }

    @Test
    void liberaQuandoOPrimeiroErroSaiDaJanela() {
        errar("a1", 5);
        relogio.avancar(Duration.ofMinutes(15));
        assertThatCode(() -> limite.exigirTentativaLiberada("a1")).doesNotThrowAnyException();
    }

    @Test
    void acertoZeraOsErros() {
        errar("a1", 4);
        limite.registrarAcerto("a1");
        errar("a1", 4);
        assertThatCode(() -> limite.exigirTentativaLiberada("a1")).doesNotThrowAnyException();
    }

    @Test
    void contaCadaRaSeparadamente() {
        errar("a1", 5);
        assertThatCode(() -> limite.exigirTentativaLiberada("a2")).doesNotThrowAnyException();
    }

    private void errar(String ra, int vezes) {
        for (int i = 0; i < vezes; i++) {
            limite.registrarErro(ra);
            relogio.avancar(Duration.ofSeconds(1));
        }
    }

    private static final class RelogioAjustavel extends Clock {

        private Instant agora = Instant.parse("2026-11-04T12:00:00Z");

        void avancar(Duration duracao) {
            agora = agora.plus(duracao);
        }

        @Override
        public Instant instant() {
            return agora;
        }

        @Override
        public ZoneOffset getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(java.time.ZoneId zona) {
            return this;
        }
    }
}
