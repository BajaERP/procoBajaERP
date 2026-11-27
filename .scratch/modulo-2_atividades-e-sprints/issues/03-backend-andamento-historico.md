# 03: Atualizar andamento e reabrir Atividades

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 2 · Atividades e Sprints](../spec.md).

**Blocked by:** [02 — Gerenciar Atividades e Backlog](02-backend-atividades-backlog.md)

## Entrega

Permitir atualizar o andamento pela API e consultar o histórico de estado, seguindo as regras por Perfil e atribuição.

## Critérios de aceitação

- [ ] Permitir iniciar, pausar, retomar e concluir conforme estado e autorização. Líder pode alterar o andamento de Atividade de que seu Subsistema participa. Membro pode fazê-lo quando for Responsável.
- [ ] Registrar autor e data da mudança e retornar o estado atual. Não oferecer Não concluída como transição de trabalho.
- [ ] Permitir reabertura motivada por Capitão ou Gestor, ou por Líder quando a Atividade for exclusiva do próprio Subsistema. Reabrir em Em andamento, preservando os resultados já gravados nas Sprints encerradas.
- [ ] Testar pela API autenticada a transição autorizada, a tentativa sem permissão e a preservação do histórico ao reabrir.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de banco e novas migrações ficam fora desta issue.

## Comments
