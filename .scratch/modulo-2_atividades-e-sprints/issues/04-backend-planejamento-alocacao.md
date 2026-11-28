# 04: Planejar, iniciar e alocar em Sprints

Status: ready-for-agent
Frente: Backend

**Especificação:** [Módulo 2 · Atividades e Sprints](../spec.md).

**Blocked by:** [02 — Gerenciar Atividades e Backlog](02-backend-atividades-backlog.md)

## Entrega

Disponibilizar a consulta de Sprints e permitir que Capitão e Gestor planejem, confirmem o início e aloquem Atividades.

## Critérios de aceitação

- [ ] Expor Sprints planejadas, em andamento e encerradas dentro do escopo autorizado, distinguindo datas previstas de datas efetivas. O planejamento permite datas ajustáveis.
- [ ] Registrar início apenas após confirmação e impedir segunda Sprint em andamento, inclusive em tentativas concorrentes.
- [ ] Aceitar Alocação em Sprint planejada ou em andamento, exigindo prazo, Estimativa válida e pelo menos um Responsável ativo. Uma Atividade tem no máximo uma Alocação vigente e sai do Backlog mesmo se a Sprint for futura.
- [ ] Retornar erros que identifiquem requisitos incompletos. Cobrir pela API autenticada Alocação antes do início, inclusão durante a Sprint, atualização do Backlog, tentativa de duplicação e permissões.

## Limite de escopo

Usar o esquema existente da develop (DBML v6, Flyway V1–V11). Alterações de banco e novas migrações ficam fora desta issue.

## Comments
