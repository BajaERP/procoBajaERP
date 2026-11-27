package com.procobajaerp.backend.atividades.service;

import java.text.Collator;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import com.procobajaerp.backend.atividades.domain.Atividade;
import com.procobajaerp.backend.atividades.domain.Sprint;
import com.procobajaerp.backend.atividades.dto.ResponsavelResumo;
import com.procobajaerp.backend.atividades.dto.SubsistemaAtividadeResumo;
import com.procobajaerp.backend.equipe.domain.Subsistema;
import com.procobajaerp.backend.equipe.domain.Usuario;

/** Helpers de ordenação e resumo compartilhados entre os services do módulo de Atividades. */
final class MapeadoresAtividades {

    private static final Collator COLLATOR = Collator.getInstance(Locale.of("pt", "BR"));

    static final Comparator<Subsistema> POR_NOME_SUBSISTEMA = Comparator
            .comparing(Subsistema::getNome, COLLATOR)
            .thenComparing(Subsistema::getId);

    static final Comparator<Usuario> POR_NOME_USUARIO = Comparator
            .comparing(Usuario::getNome, COLLATOR)
            .thenComparing(Usuario::getId);

    private MapeadoresAtividades() {
    }

    static List<SubsistemaAtividadeResumo> subsistemasOrdenados(Atividade atividade) {
        return atividade.getSubsistemas().stream()
                .sorted(POR_NOME_SUBSISTEMA)
                .map(SubsistemaAtividadeResumo::de)
                .toList();
    }

    static List<ResponsavelResumo> responsaveisOrdenados(Atividade atividade) {
        return atividade.getResponsaveis().stream()
                .sorted(POR_NOME_USUARIO)
                .map(ResponsavelResumo::de)
                .toList();
    }

    static List<Sprint> ordenarSprints(List<Sprint> lista) {
        List<Sprint> emAndamento = new ArrayList<>();
        List<Sprint> planejadas = new ArrayList<>();
        List<Sprint> encerradas = new ArrayList<>();
        for (Sprint sprint : lista) {
            switch (sprint.getSituacao()) {
                case EM_ANDAMENTO -> emAndamento.add(sprint);
                case PLANEJADA -> planejadas.add(sprint);
                case ENCERRADA -> encerradas.add(sprint);
            }
        }
        planejadas.sort(Comparator.comparing(Sprint::getInicio).thenComparing(Sprint::getId));
        encerradas.sort(Comparator.comparing(Sprint::getEncerradaEm, Comparator.reverseOrder())
                .thenComparing(Sprint::getId, Comparator.reverseOrder()));
        List<Sprint> resultado = new ArrayList<>(lista.size());
        resultado.addAll(emAndamento);
        resultado.addAll(planejadas);
        resultado.addAll(encerradas);
        return resultado;
    }

    static String normalizarTexto(String texto) {
        return texto == null || texto.isBlank() ? null : texto.strip();
    }
}
