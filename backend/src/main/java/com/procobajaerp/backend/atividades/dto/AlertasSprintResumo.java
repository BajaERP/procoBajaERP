package com.procobajaerp.backend.atividades.dto;

import java.time.LocalDate;

public record AlertasSprintResumo(
        LocalDate dataInicioAlertaPoucoProgresso,
        boolean segundaMetadeAtingida,
        boolean dataFinalAtingida) {
}
