# 18: Integrar saldo e Previsão à fonte real

Status: blocked
Frente: Frontend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 17–20, 23–25, 27.

**Blocked by:** [07 — Demonstrar saldo e Previsão de caixa com mocks](07-frontend-saldo-previsao-mocks.md); [13 — Verificar consulta de saldo e Previsão de caixa](13-backend-consulta-saldo-previsao.md) Dependência externa indireta via issue 13: [Módulo 3 · 07 — Consultar saldo, Previsão de caixa e gastos](../../modulo-3_gestao-financeira/issues/07-backend-saldo-previsao-relatorios.md).

## Entrega

Ativar o cartão financeiro para Capitão e Gestor Financeiro.

## Critérios de aceitação

- [ ] Verificar com sessão real saldo efetivo separado de Previsão de caixa e conferir a manutenção dos cartões operacionais para Gestor Financeiro.
- [ ] Verificar com Perfis sem acesso a ausência do cartão e dos dados financeiros na resposta. Conferir a mudança de Gestor Financeiro para Gestor sem essa atribuição.
- [ ] Verificar zero, ausência de dados, falha e nova tentativa deste cartão, preservando as consultas operacionais.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
