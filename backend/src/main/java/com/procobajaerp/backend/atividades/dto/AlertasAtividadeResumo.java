package com.procobajaerp.backend.atividades.dto;

public record AlertasAtividadeResumo(boolean poucoProgresso, boolean atrasada, boolean transferida,
        boolean semResponsavelAtivo) {

    public static final AlertasAtividadeResumo NENHUM = new AlertasAtividadeResumo(false, false, false, false);
}
