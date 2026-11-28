# 06: Expor alertas e indicações

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 2 · Atividades e Sprints](../spec.md).

**Blocked by:** [05 — Retirar, transferir e encerrar Sprints](05-backend-retirada-encerramento.md)

## Entrega

Expor nos dados autorizados do módulo os avisos de calendário e as indicações da Atividade, usando as regras da especificação.

## Critérios de aceitação

- [ ] Usar as datas planejadas e o horário de Brasília. Expor pouco progresso a partir do dia que marca a metade para Não iniciada e Pausada, atraso a partir do dia seguinte ao prazo para Em andamento e sinalização de data final da Sprint.
- [ ] Expor Transferida a partir das passagens entre Sprints. Sinalizar necessidade de nova atribuição quando uma Atividade alocada perde seu último Responsável ativo, preservando sua Alocação.
- [ ] Expor sinais distintos, limitados ao escopo autorizado. Testar datas fixas antes e no início dos alertas, incluindo a virada do dia em Brasília.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de banco e novas migrações ficam fora desta issue.

## Comments
