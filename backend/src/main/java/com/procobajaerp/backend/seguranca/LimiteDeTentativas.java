package com.procobajaerp.backend.seguranca;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Recusa o login de um RA depois de 5 erros em 15 minutos, até a janela passar. A contagem fica em memória e
 * zera quando o backend reinicia.
 */
@Component
public class LimiteDeTentativas {

    static final int MAXIMO_DE_ERROS = 5;
    static final Duration JANELA = Duration.ofMinutes(15);

    private final Clock relogio;
    private final Map<String, Deque<Instant>> erros = new ConcurrentHashMap<>();

    @Autowired
    public LimiteDeTentativas() {
        this(Clock.systemUTC());
    }

    LimiteDeTentativas(Clock relogio) {
        this.relogio = relogio;
    }

    public void exigirTentativaLiberada(String ra) {
        AtomicBoolean bloqueado = new AtomicBoolean();
        erros.computeIfPresent(ra, (chave, recentes) -> {
            descartarAntigos(recentes);
            bloqueado.set(recentes.size() >= MAXIMO_DE_ERROS);
            return recentes.isEmpty() ? null : recentes;
        });
        if (bloqueado.get()) {
            throw new TentativasExcedidasException();
        }
    }

    public void registrarErro(String ra) {
        erros.compute(ra, (chave, recentes) -> {
            Deque<Instant> atualizados = recentes == null ? new ArrayDeque<>() : recentes;
            descartarAntigos(atualizados);
            atualizados.addLast(relogio.instant());
            return atualizados;
        });
    }

    public void registrarAcerto(String ra) {
        erros.remove(ra);
    }

    private void descartarAntigos(Deque<Instant> recentes) {
        Instant limite = relogio.instant().minus(JANELA);
        while (!recentes.isEmpty() && !recentes.peekFirst().isAfter(limite)) {
            recentes.removeFirst();
        }
    }
}
