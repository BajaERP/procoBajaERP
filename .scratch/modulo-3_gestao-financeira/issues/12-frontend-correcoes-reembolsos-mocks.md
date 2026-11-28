# 12: Correção de Pagamento e Reembolsos com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 3 · Gestão Financeira](../spec.md).
**Histórias cobertas:** 25–26, 34.

**Blocked by:** [11 — Pagamento e Previsão vinculada com mocks](11-frontend-pagamento-previsao-mocks.md)

## Entrega

Entregar os fluxos demonstrativos de correção de Pagamento e Reembolso.

## Critérios de aceitação

- [ ] Demonstrar cancelamento motivado de Saída indevida, preservação do histórico, atualização da Previsão e retorno da Compra para Aprovada para permitir novo Pagamento.
- [ ] Demonstrar Reembolso total ou parcial como Entrada vinculada. Exibir erro de limite excedido e consultar a Saída original e as devoluções.
- [ ] Usar as capacidades e erros do contrato e atualizar as consultas afetadas após sucesso.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
