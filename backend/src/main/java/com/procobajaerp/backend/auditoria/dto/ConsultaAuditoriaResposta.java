package com.procobajaerp.backend.auditoria.dto;

import java.util.List;

public record ConsultaAuditoriaResposta(List<EventoAuditoriaResposta> content, int page, int size,
        long totalElements, int totalPages) {
}
