# 11: Administrar Inscrições com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 17, 24–26, 40.

**Blocked by:** [08 — Montar agenda e cadastro com mocks](08-frontend-agenda-cadastro-mocks.md)

## Entrega

Simular cadastro, alteração e consulta de Inscrições da Competição.

## Critérios de aceitação

- [ ] Oferecer ações de inscrição a Capitão e Gestor. Exibir ao Integrante a própria Inscrição, com a situação correta.
- [ ] Demonstrar Pendente, Confirmada e Cancelada, feedback de duplicidade e nova tentativa. Preservar a Inscrição cancelada no histórico e simular sua saída das sugestões de chamada.
- [ ] Verificar lista, detalhe e formulário responsivos, incluindo estado vazio e consulta restrita.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
