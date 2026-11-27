# 13: Verificar consulta de saldo e Previsão de caixa

Status: blocked
Frente: Backend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 17–20, 23–24.

**Blocked by:** [01 — Fechar o contrato dos cartões](01-contrato-cartoes.md); [Módulo 3 · 07 — Consultar saldo, Previsão de caixa e gastos](../../modulo-3_gestao-financeira/issues/07-backend-saldo-previsao-relatorios.md)

## Entrega

Garantir que o Financeiro entregue saldo e Previsão atuais somente aos Perfis autorizados.

## Critérios de aceitação

- [ ] Validar respostas distintas para saldo efetivo e Previsão de caixa. Usar a consulta do Módulo 3 para regras de Movimentações e Previsões pendentes.
- [ ] Testar Capitão, Gestor Financeiro, Gestor sem atribuição financeira e outros Perfis. Aplicar a autorização antes de retornar valores ou metadados protegidos, inclusive em acesso direto e após perder a atribuição.
- [ ] Verificar zero e falta de dados. Ajustar campos ou filtros na própria consulta do Financeiro caso o contrato exija.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
