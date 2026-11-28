# 07: Consultar saldo, Previsão de caixa e gastos

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 3 · Gestão Financeira](../spec.md).
**Histórias cobertas:** 32–33.

**Blocked by:** [06 — Corrigir Pagamentos e registrar Reembolsos](06-backend-correcoes-reembolsos.md)

## Entrega

Expor dados autorizados de saldo, Previsão de caixa, histórico de Solicitações e Compras, e gastos por Subsistema e período.

## Critérios de aceitação

- [ ] Separar saldo efetivo e valores previstos. Excluir Movimentações canceladas dos valores ativos e considerar somente Previsões pendentes na Previsão de caixa.
- [ ] Identificar Compra compartilhada e exibir seu valor integral em cada Subsistema vinculado. Contabilizar a Compra apenas uma vez no total da equipe.
- [ ] Aplicar autorização antes de retornar totais, resultados filtrados ou históricos. Verificar pela API a deduplicação e a confidencialidade com perfis e Subsistemas distintos.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
