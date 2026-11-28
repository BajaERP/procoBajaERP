# 07: Demonstrar saldo e Previsão de caixa com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 8 · Dashboard e Indicadores](../spec.md).
**Histórias cobertas:** 17–20, 23–25, 28.

**Blocked by:** [02 — Montar a tela inicial e os estados dos cartões](02-frontend-tela-estados-mocks.md)

## Entrega

Demonstrar os indicadores financeiros autorizados junto à visão operacional.

## Critérios de aceitação

- [ ] Apresentar saldo efetivo atual e Previsão de caixa atual separadamente. Mostrar o cartão a Capitão e Gestor Financeiro, preservando as demais permissões de Gestor.
- [ ] Simular Perfis autorizados e Perfis sem permissão financeira. Conferir que valores ou metadados restritos estejam ausentes dos mocks consumidos por Perfis sem acesso.
- [ ] Demonstrar zero, falta de dados, falha e nova tentativa sem afetar os cartões operacionais.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
