# 04: Operar caixa e Previsões avulsas

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 3 · Gestão Financeira](../spec.md).
**Histórias cobertas:** 28–30.

**Blocked by:** [01 — Fechar o contrato da API](01-contrato-api.md)

## Entrega

Permitir que Capitão e Gestor Financeiro operem e consultem Movimentações e Previsões avulsas.

## Critérios de aceitação

- [ ] Registrar Entradas, Saídas e Previsões avulsas com Categoria compatível, data, valor e descrição. A Saída vinculada nasce do fluxo de Pagamento da issue 05.
- [ ] Permitir cancelamentos autorizados com motivo, autor e data. Preservar Movimentações canceladas no histórico e excluí-las dos valores ativos.
- [ ] Verificar pela API autenticada Categoria incompatível, cancelamento rastreável e rejeição de operações e consultas por perfis sem acesso financeiro.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
