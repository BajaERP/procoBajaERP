package com.procobajaerp.backend.atividades.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

import com.procobajaerp.backend.atividades.domain.DesfechoAlocacao;
import com.procobajaerp.backend.atividades.domain.EstadoAtividade;
import com.procobajaerp.backend.atividades.domain.TipoEntradaSprint;
import com.procobajaerp.backend.equipe.dto.Resumo;

public record HistoricoAtividadeResposta(
        Long atividadeId,
        List<ItemAndamento> andamento,
        List<ItemPlanejamento> planejamento,
        List<ItemAlocacao> alocacoes) {

    public record ItemAndamento(
            Long id,
            EstadoAtividade statusAnterior,
            EstadoAtividade statusNovo,
            Resumo alteradoPor,
            OffsetDateTime alteradoEm,
            String observacao) {
    }

    public record ItemPlanejamento(
            Long id,
            Resumo alteradoPor,
            OffsetDateTime alteradoEm,
            Map<String, Object> dadosAnteriores,
            Map<String, Object> dadosNovos) {
    }

    public record ItemAlocacao(
            Long id,
            SprintResumo sprint,
            TipoEntradaSprint origem,
            Long transferidaDaAlocacaoId,
            OffsetDateTime entradaEm,
            OffsetDateTime saidaEm,
            DesfechoAlocacao desfecho,
            EstadoAtividade estadoNoEncerramento,
            boolean retiradaAntesEncerramento,
            Resumo transferidaPor,
            Resumo encerradaPor,
            String motivoTransferencia) {
    }
}
