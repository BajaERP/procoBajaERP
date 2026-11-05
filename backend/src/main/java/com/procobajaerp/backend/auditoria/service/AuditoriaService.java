package com.procobajaerp.backend.auditoria.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.procobajaerp.backend.auditoria.domain.RegistroDeAuditoria;
import com.procobajaerp.backend.auditoria.repository.RegistroDeAuditoriaRepository;

import tools.jackson.databind.json.JsonMapper;

/**
 * Grava Registros de auditoria na mesma transação da operação auditada, para que um não exista sem o
 * outro. Cada módulo escolhe os nomes de entidade e ação que usa.
 */
@Service
public class AuditoriaService {

    private final RegistroDeAuditoriaRepository registros;
    private final JsonMapper json;

    public AuditoriaService(RegistroDeAuditoriaRepository registros, JsonMapper json) {
        this.registros = registros;
        this.json = json;
    }

    @Transactional
    public void registrar(Long atorId, String entidade, Long registroId, String acao, Map<String, ?> detalhes) {
        String detalhesJson = detalhes.isEmpty() ? null : json.writeValueAsString(detalhes);
        registros.save(new RegistroDeAuditoria(atorId, entidade, registroId, acao, detalhesJson));
    }

    /** Monta os detalhes a partir de pares chave e valor, aceitando valores nulos e mantendo a ordem. */
    public static Map<String, Object> detalhes(Object... chavesEValores) {
        Map<String, Object> detalhes = new LinkedHashMap<>();
        for (int i = 0; i < chavesEValores.length; i += 2) {
            detalhes.put((String) chavesEValores[i], chavesEValores[i + 1]);
        }
        return detalhes;
    }
}
