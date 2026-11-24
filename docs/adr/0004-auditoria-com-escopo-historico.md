# ADR 0004: consulta de auditoria com escopo histórico

**Status:** Aceito
**Data:** 2026-11-24

## Contexto

O Módulo 1 já grava alterações em `logs_auditoria`, mas a tabela não identifica a qual Subsistema cada evento pertence. Líderes precisam acompanhar alterações da própria composição, inclusive transferências de saída e entrada, sem receber o histórico geral. Registros antigos não têm informação suficiente para determinar esse escopo.

## Decisão

- Persistir os Subsistemas de origem e destino no próprio evento, conforme os vínculos existentes no instante da operação.
- Permitir consulta geral ao Capitão e ao Gestor. Permitir ao Líder apenas eventos cujo Subsistema de origem ou destino seja seu Subsistema atual.
- Manter eventos anteriores à migration sem escopo e restringi-los à consulta geral.
- Aplicar paginação, filtros e autorização no servidor. A API retorna apenas campos de apresentação; detalhes JSON permanecem internos.
- Nunca devolver RA, SIAPE, hash ou senha na consulta de auditoria.

## Consequências

- A migration adiciona relações opcionais para os escopos de origem e destino e cria índices para filtrar por eles e ordenar por data.
- Operações de usuário, Subsistema, liderança, transferência e sucessão passam o escopo ao serviço de auditoria ao gravar.
- Transferências aparecem tanto para o Subsistema de saída quanto para o de entrada, mesmo que os vínculos mudem depois.
- Eventos sem escopo ou produzidos por operações do sistema ficam disponíveis apenas ao Capitão e ao Gestor.
