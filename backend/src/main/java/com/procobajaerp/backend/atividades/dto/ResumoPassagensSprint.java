package com.procobajaerp.backend.atividades.dto;

public record ResumoPassagensSprint(
        int total,
        int emAberto,
        int concluidas,
        int naoConcluidas,
        int retiradas) {
}
