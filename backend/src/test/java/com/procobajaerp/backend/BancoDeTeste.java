package com.procobajaerp.backend;

import java.io.IOException;
import java.io.UncheckedIOException;

import org.springframework.test.context.DynamicPropertyRegistry;

import io.zonky.test.db.postgres.embedded.EmbeddedPostgres;

/**
 * PostgreSQL 16 embutido, iniciado uma vez por execução dos testes. Dispensa Docker e as variáveis
 * SPRING_DATASOURCE_*; o Flyway aplica as migrations como em produção.
 */
public final class BancoDeTeste {

    private static EmbeddedPostgres postgres;

    private BancoDeTeste() {
    }

    public static synchronized void registrar(DynamicPropertyRegistry propriedades) {
        if (postgres == null) {
            try {
                postgres = EmbeddedPostgres.builder().start();
            } catch (IOException e) {
                throw new UncheckedIOException("Não foi possível iniciar o PostgreSQL embutido dos testes.", e);
            }
            Runtime.getRuntime().addShutdownHook(new Thread(BancoDeTeste::parar));
        }
        propriedades.add("spring.datasource.url", () -> postgres.getJdbcUrl("postgres", "postgres"));
        propriedades.add("spring.datasource.username", () -> "postgres");
        propriedades.add("spring.datasource.password", () -> "");
    }

    private static void parar() {
        try {
            postgres.close();
        } catch (IOException e) {
            // O processo está terminando; não há o que fazer.
        }
    }
}
