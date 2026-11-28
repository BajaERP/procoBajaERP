# 05: Retirar, transferir e encerrar Sprints

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 2 · Atividades e Sprints](../spec.md).

**Blocked by:** [03 — Atualizar andamento e reabrir Atividades](03-backend-andamento-historico.md), [04 — Planejar, iniciar e alocar em Sprints](04-backend-planejamento-alocacao.md)

## Entrega

Permitir que Capitão e Gestor retirem Atividades e encerrem a Sprint com destino definido para cada pendência. Consultar o resultado por passagem sem perder o histórico.

## Critérios de aceitação

- [ ] Uma retirada registra autor, motivo e destino. Retornar ao Backlog quando não houver outra Alocação. Distinguir retirada de Atividade Não concluída no fechamento.
- [ ] Encerrar após confirmação. Registrar o resultado de cada passagem e escolher, para cada pendência, Backlog ou Sprint futura já planejada. O destino mantém o estado de trabalho.
- [ ] Validar todos os destinos e requisitos e persistir a operação em uma única transação. Destino inválido ou conflito concorrente preserva a Sprint em andamento e as Alocações intactas.
- [ ] A transferência mantém origem, cadeia de passagens e prazo. Uma alteração de prazo fica no histórico como ação explícita. A consulta distingue estado atual, retirada e resultado de cada Sprint.
- [ ] Testar pela API fechamento com destinos mistos, retirada, falha sem movimentação parcial e possibilidade de consultar o histórico após transferência ou reabertura.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de banco e novas migrações ficam fora desta issue.

## Comments
