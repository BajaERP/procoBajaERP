# 11: Pagamento e Previsão vinculada com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 3 · Gestão Financeira](../spec.md).
**Histórias cobertas:** 21–24, 31, 34.

**Blocked by:** [09 — Aprovações com mocks](09-frontend-aprovacoes-mocks.md); [10 — Caixa e Previsões avulsas com mocks](10-frontend-caixa-previsoes-avulsas-mocks.md)

## Entrega

Demonstrar Pagamento integral, Previsão vinculada e cancelamento de Compra antes de pagar.

## Critérios de aceitação

- [ ] Exibir Orçamento aprovado e permitir preencher data, valor, referência e observação quando houver desconto.
- [ ] Demonstrar o retorno à aprovação quando houver aumento do total com frete ou troca de Fornecedor. Permitir cancelamento motivado antes do Pagamento.
- [ ] Atualizar de forma consistente Compra, Saída e Previsão após sucesso simulado, incluindo Compra com data prevista. Exibir validação, conflito e ações permitidas em desktop e mobile.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
