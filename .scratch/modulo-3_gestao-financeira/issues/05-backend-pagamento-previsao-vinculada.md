# 05: Registrar Pagamento e Previsão vinculada

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 3 · Gestão Financeira](../spec.md).
**Histórias cobertas:** 21–24, 31.

**Blocked by:** [03 — Aprovar ou reprovar uma Revisão](03-backend-aprovacao-conjunta.md); [04 — Operar caixa e Previsões avulsas](04-backend-caixa-previsoes-avulsas.md)

## Entrega

Registrar Pagamentos integrais de Compras aprovadas e sincronizar a Saída e a Previsão da Compra.

## Critérios de aceitação

- [ ] Permitir a Capitão e Gestor Financeiro cancelar Compra aprovada antes de pagar, com motivo. Se houver Previsão vinculada, cancelá-la.
- [ ] Usar o Orçamento aprovado e registrar data, valor efetivo em BRL e referência. Comparar os totais com frete. Aumento ou troca de Fornecedor exige nova Revisão e aprovação. Desconto para os mesmos itens e quantidades no mesmo Fornecedor exige observação.
- [ ] Gerar Previsão de Saída vinculada a uma Compra aprovada com data prevista. No Pagamento, marcar a Compra Realizada/Paga, criar exatamente uma Saída ativa e realizar a Previsão vinculando-a à Saída, na mesma transação.
- [ ] Verificar pela API Pagamento igual e menor que o aprovado, aumento com frete, troca de Fornecedor, tentativa repetida ou concorrente, cancelamento anterior ao Pagamento e consistência de Compra, Saída e Previsão.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
