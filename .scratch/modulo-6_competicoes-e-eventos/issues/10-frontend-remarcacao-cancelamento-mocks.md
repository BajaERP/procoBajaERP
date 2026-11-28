# 10: Remarcar e cancelar com mocks

Status: ready-for-agent
Frente: Frontend

**Especificação:** [Módulo 6 · Competições e Eventos](../spec.md).
**Histórias cobertas:** 31–35, 40.

**Blocked by:** [08 — Montar agenda e cadastro com mocks](08-frontend-agenda-cadastro-mocks.md)

## Entrega

Simular remarcação, correção de data e cancelamento no detalhe do Evento.

## Critérios de aceitação

- [ ] Exibir datas anteriores e novas, motivo opcional na remarcação e justificativa obrigatória na correção após lançamento final, mesmo pendente de Validação.
- [ ] Mostrar a ação de cancelar conforme Perfil e escopo da Reunião. Exigir motivo e mostrar o cancelamento, autor e data no Histórico.
- [ ] Verificar com mocks a preservação dos vínculos e o feedback de autorização, erro de data, conflito e nova tentativa, em desktop e mobile.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de esquema e novas migrações ficam fora desta issue.

## Comments
