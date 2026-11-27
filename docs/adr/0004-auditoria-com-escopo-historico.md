# ADR 0004 — Consulta de auditoria com escopo histórico

**Status:** Aceito

**Data:** 2026-11-24

## Contexto

O Módulo 1 já gravava alterações em `logs_auditoria` antes de registrar os Subsistemas envolvidos. A consulta do Líder precisa abranger alterações da própria Composição, incluindo transferências de saída e entrada. Registros antigos podem ter escopo desconhecido.

## Decisão

- Persistir os Subsistemas de origem e destino no próprio evento, conforme os vínculos existentes no instante da operação.
- Permitir consulta geral ao Capitão e ao Gestor. Permitir ao Líder apenas eventos cujo Subsistema de origem ou destino seja seu Subsistema atual.
- Manter eventos anteriores à migration sem escopo e restringi-los à consulta geral.
- Aplicar autorização e filtros no servidor antes de contar e paginar. A resposta contém os campos de apresentação. Identificadores acadêmicos, credenciais e JSON bruto permanecem internos.

## Consequências

- A [migração V10](../../backend/src/main/resources/db/migration/V10__escopo_historico_auditoria.sql) adiciona os escopos opcionais de origem e destino e índices de consulta.
- Operações de usuário, Subsistema, liderança, transferência e sucessão passam o escopo ao serviço de auditoria ao gravar.
- Transferências aparecem tanto para o Subsistema de saída quanto para o de entrada, mesmo que os vínculos mudem depois.
- Eventos sem escopo ou produzidos por operações do sistema ficam disponíveis apenas ao Capitão e ao Gestor.

Consulte a [arquitetura do backend](../../backend/ARCHITECTURE.md) para o contrato da consulta de auditoria.
